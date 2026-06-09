import { describe, it, expect } from 'vitest';
import { maskEmail } from './maskEmail';

describe('maskEmail', () => {
  it('앞 2글자만 보이고 나머지는 마스킹된다', () => {
    expect(maskEmail('dodobird@example.com')).toBe('do******@example.com');
  });

  it('로컬 파트가 2글자면 마스킹하지 않는다', () => {
    expect(maskEmail('ab@example.com')).toBe('ab@example.com');
  });

  it('로컬 파트가 1글자면 마스킹하지 않는다', () => {
    expect(maskEmail('a@example.com')).toBe('a@example.com');
  });

  it('로컬 파트가 3글자면 마지막 1글자만 마스킹된다', () => {
    expect(maskEmail('abc@example.com')).toBe('ab*@example.com');
  });

  it('@가 없는 잘못된 이메일은 그대로 반환한다', () => {
    expect(maskEmail('notanemail')).toBe('notanemail');
  });

  it('빈 문자열은 그대로 반환한다', () => {
    expect(maskEmail('')).toBe('');
  });
});