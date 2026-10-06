import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * ============================================================================
 * 1. AUTHENTICATION HELPERS
 * ============================================================================
 */

export async function signUpUser(email, password) {
  if (!supabase) throw new Error('Supabase is not configured.');
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

export async function signInUser(email, password) {
  if (!supabase) throw new Error('Supabase is not configured.');
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

export async function signInWithGoogle() {
  if (!supabase) throw new Error('Supabase is not configured.');
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin,
    }
  });
  if (error) throw error;
  return data;
}

export async function signOutUser() {
  if (!supabase) return;
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  if (!supabase) return null;
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user || null;
}

/**
 * ============================================================================
 * 2. DATABASE (DOCUMENTS & CHATS) HELPERS
 * ============================================================================
 */

// Helper to check if string is valid UUID
function isValidUUID(str) {
  if (!str) return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

export async function saveDocumentToCloud(doc, userId) {
  if (!supabase) return null;

  try {
    const payload = {
      user_id: userId || null,
      name: doc.name || doc.title,
      num_pages: doc.numPages || 1,
      word_count: doc.wordCount || 0,
      full_text: doc.fullText || '',
      pages_json: doc.pages || [],
    };

    if (isValidUUID(doc.id)) {
      payload.id = doc.id;
    }

    const { data, error } = await supabase
      .from('documents')
      .upsert(payload)
      .select()
      .single();

    if (error) {
      console.warn('Supabase DB save error:', error.message);
      return null;
    }
    return data;
  } catch (e) {
    console.warn('Database save error:', e);
    return null;
  }
}

export async function fetchUserDocumentsFromCloud(userId) {
  if (!supabase) return [];

  try {
    let query = supabase
      .from('documents')
      .select('*, chat_messages(*)')
      .order('created_at', { ascending: false });

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;
    if (error) {
      console.warn('Fetch documents error:', error.message);
      return [];
    }

    return (data || []).map(row => ({
      id: row.id,
      name: row.name,
      numPages: row.num_pages,
      wordCount: row.word_count,
      pages: row.pages_json || [],
      fullText: row.full_text,
      messages: (row.chat_messages || []).map(m => ({
        role: m.role,
        content: m.content,
        citations: m.citations || [],
      })),
      timestamp: row.created_at,
    }));
  } catch (e) {
    console.warn('Cloud fetch failed:', e);
    return [];
  }
}

export async function saveChatMessageToCloud(documentId, userId, message) {
  if (!supabase || !documentId) return;

  if (!isValidUUID(documentId)) {
    console.warn('Skipping cloud save: documentId is not a valid UUID:', documentId);
    return;
  }

  try {
    const { error } = await supabase
      .from('chat_messages')
      .insert({
        document_id: documentId,
        user_id: userId || null,
        role: message.role,
        content: message.content,
        citations: message.citations || [],
      });

    if (error) console.warn('Chat message cloud save error:', error.message);
  } catch (e) {
    console.warn('Chat message save error:', e);
  }
}

export async function deleteDocumentFromCloud(documentId) {
  if (!supabase || !documentId) return;
  try {
    await supabase.from('documents').delete().eq('id', documentId);
  } catch (e) {
    console.warn('Delete doc error:', e);
  }
}
