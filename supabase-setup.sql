-- ===================================
-- PIANO Website - Supabase 초기 설정
-- 프로젝트: piano-website (OnlyGens와 별도)
-- ===================================

-- 동의 기록 테이블
CREATE TABLE piano_consents (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    ip TEXT,
    user_agent TEXT,
    consents JSONB NOT NULL
);

-- 인덱스
CREATE INDEX idx_piano_consents_email ON piano_consents(email);
CREATE INDEX idx_piano_consents_created ON piano_consents(created_at DESC);

-- RLS 활성화
ALTER TABLE piano_consents ENABLE ROW LEVEL SECURITY;

-- 누구나 INSERT 가능 (동의 제출용, anon key)
CREATE POLICY "Anyone can insert consent"
    ON piano_consents FOR INSERT
    TO anon
    WITH CHECK (true);

-- SELECT/UPDATE/DELETE는 인증된 사용자만 (관리자용)
CREATE POLICY "Only authenticated can read consents"
    ON piano_consents FOR SELECT
    TO authenticated
    USING (true);
