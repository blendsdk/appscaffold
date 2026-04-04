import { describe, it, expect } from 'vitest';
import { render } from '../renderer.js';

describe('render', () => {
    it('replaces a single placeholder', () => {
        const result = render('Hello {{NAME}}!', { NAME: 'World' });
        expect(result).toBe('Hello World!');
    });

    it('replaces multiple different placeholders', () => {
        const result = render('{{GREETING}} {{NAME}}!', { GREETING: 'Hi', NAME: 'Test' });
        expect(result).toBe('Hi Test!');
    });

    it('leaves unmatched placeholders as-is', () => {
        const result = render('{{KNOWN}} and {{UNKNOWN}}', { KNOWN: 'yes' });
        expect(result).toBe('yes and {{UNKNOWN}}');
    });

    it('handles empty template', () => {
        const result = render('', { NAME: 'Test' });
        expect(result).toBe('');
    });

    it('handles template with no placeholders', () => {
        const result = render('Just plain text', { NAME: 'Test' });
        expect(result).toBe('Just plain text');
    });

    it('handles empty vars', () => {
        const result = render('Hello {{NAME}}!', {});
        expect(result).toBe('Hello {{NAME}}!');
    });

    it('handles repeated placeholder', () => {
        const result = render('{{NAME}} likes {{NAME}}', { NAME: 'Alice' });
        expect(result).toBe('Alice likes Alice');
    });

    it('replaces placeholders with underscores and numbers', () => {
        const result = render('Port: {{BACKEND_PORT}}, DB: {{DB_PORT}}', {
            BACKEND_PORT: '4000',
            DB_PORT: '5432',
        });
        expect(result).toBe('Port: 4000, DB: 5432');
    });

    it('does not match lowercase placeholders', () => {
        const result = render('{{name}} stays', { name: 'test' });
        expect(result).toBe('{{name}} stays');
    });

    it('does not match placeholders starting with numbers', () => {
        const result = render('{{1NAME}} stays', { '1NAME': 'test' });
        expect(result).toBe('{{1NAME}} stays');
    });
});
