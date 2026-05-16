#!/usr/bin/env node
/**
 * SLOWHRS Supabase Connection Diagnostic
 * Tests: env vars → connection → table access → insert → read → cleanup
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Manual .env.local parser
function loadEnv() {
  try {
    const content = readFileSync(resolve(process.cwd(), '.env.local'), 'utf-8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIndex = trimmed.indexOf('=');
      if (eqIndex === -1) continue;
      const key = trimmed.slice(0, eqIndex).trim();
      const val = trimmed.slice(eqIndex + 1).trim();
      if (!process.env[key]) process.env[key] = val;
    }
  } catch { console.log('⚠️ No .env.local found'); }
}

loadEnv();

const PASS = '✅';
const FAIL = '❌';
const WARN = '⚠️';

async function main() {
  console.log('\n=== SLOWHRS SUPABASE DIAGNOSTIC ===\n');

  // 1. CHECK ENV VARS
  console.log('1. ENVIRONMENT VARIABLES');
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const resendKey = process.env.RESEND_API_KEY;
  const resendFrom = process.env.RESEND_FROM_EMAIL;
  const inquiryTo = process.env.INQUIRY_EMAIL_TO;

  console.log(`  SUPABASE_URL:        ${url ? PASS + ' ' + url : FAIL + ' MISSING'}`);
  console.log(`  ANON_KEY:            ${anonKey ? PASS + ' ' + anonKey.slice(0, 20) + '...' : FAIL + ' MISSING'}`);
  console.log(`  SERVICE_ROLE_KEY:    ${serviceKey ? PASS + ' ' + serviceKey.slice(0, 20) + '...' : FAIL + ' MISSING'}`);
  console.log(`  RESEND_API_KEY:      ${resendKey ? PASS + ' ' + resendKey.slice(0, 15) + '...' : FAIL + ' MISSING'}`);
  console.log(`  RESEND_FROM_EMAIL:   ${resendFrom ? PASS + ' ' + resendFrom : WARN + ' defaults to onboarding@resend.dev'}`);
  console.log(`  INQUIRY_EMAIL_TO:    ${inquiryTo ? PASS + ' ' + inquiryTo : WARN + ' defaults to hello@slowhrs.com'}`);
  console.log();

  if (!url || !serviceKey) {
    console.log(`${FAIL} FATAL: Missing Supabase URL or service role key. Cannot continue.`);
    process.exit(1);
  }

  // 2. TEST CONNECTION
  console.log('2. SUPABASE CONNECTION');
  const supabase = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // 3. CHECK ALL TABLES
  console.log('3. TABLE CHECK');
  const tables = ['inquiries', 'applications', 'members', 'events', 'attendances', 'broadcasts', 'chat_messages'];
  let tablesOk = true;
  
  for (const table of tables) {
    const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
    if (error) {
      console.log(`  ${FAIL} ${table}: ${error.message}`);
      tablesOk = false;
    } else {
      console.log(`  ${PASS} ${table}: ${count} rows`);
    }
  }
  
  if (!tablesOk) {
    console.log(`\n  ${FAIL} SOME TABLES MISSING — run the SQL setup:`);
    console.log(`  1. Open Supabase Dashboard → SQL Editor`);
    console.log(`  2. Paste contents of: supabase/RUN_THIS_IN_SUPABASE.sql`);
    console.log(`  3. Click RUN`);
    console.log();
  }
  console.log();

  // 4. TEST INSERT + READ
  console.log('4. TEST INSERT → inquiries');
  const testRow = {
    category: '__diagnostic_test',
    name: 'Diagnostic Bot',
    email: 'test@diagnostic.local',
    instagram: '@test_diag',
    message: 'Automated diagnostic. Safe to delete.',
  };

  const { data: inserted, error: insertError } = await supabase
    .from('inquiries')
    .insert(testRow)
    .select('id, created_at')
    .single();

  if (insertError) {
    console.log(`  ${FAIL} INSERT FAILED: ${insertError.message}`);
    console.log(`     Code: ${insertError.code || 'none'}`);
    console.log(`     Details: ${insertError.details || 'none'}`);
    console.log(`     Hint: ${insertError.hint || 'none'}`);
    
    if (insertError.code === '42501') {
      console.log(`\n  ${FAIL} PERMISSION DENIED — your service role key may be wrong.`);
    }
    if (insertError.message?.includes('does not exist')) {
      console.log(`\n  ${FAIL} Table does not exist. Run the SQL setup script.`);
    }
  } else {
    console.log(`  ${PASS} INSERT OK — id: ${inserted.id}`);
    console.log(`     created_at: ${inserted.created_at}`);

    // Read back
    const { data: readBack, error: readErr } = await supabase
      .from('inquiries')
      .select('*')
      .eq('id', inserted.id)
      .single();

    if (readErr) {
      console.log(`  ${FAIL} READ-BACK FAILED: ${readErr.message}`);
    } else {
      console.log(`  ${PASS} READ-BACK OK — data verified`);
    }

    // Cleanup
    await supabase.from('inquiries').delete().eq('id', inserted.id);
    console.log(`  ${PASS} Test row cleaned up`);
  }

  // 5. RESEND CHECK
  console.log('\n5. RESEND EMAIL CONFIG');
  if (!resendKey) {
    console.log(`  ${FAIL} No RESEND_API_KEY — emails will silently fail`);
  } else {
    console.log(`  ${PASS} API key present`);
    if (resendFrom?.includes('onboarding@resend.dev')) {
      console.log(`  ${WARN} Using Resend test sender — emails only reach the account owner`);
      console.log(`     To send to real users: verify your domain at resend.com/domains`);
    } else {
      console.log(`  ${PASS} Custom from: ${resendFrom}`);
    }
  }

  console.log('\n=== DIAGNOSTIC COMPLETE ===\n');
}

main().catch(console.error);
