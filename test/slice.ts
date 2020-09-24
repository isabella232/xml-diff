import { strictEqual as equal, deepStrictEqual as deepEqual } from 'assert';
import { parse, slice, fragment } from '../src';

describe('XML Slice', () => {
    it('slice', () => {
        const doc = parse('<div>aaa <a>foo <b>bar</b> baz</a> bbb</div>');

        // Simple cases: full tag overlap
        let s = slice(doc, 4, 15);
        equal(s.toString('ins'), '<ins><a>foo <b>bar</b> baz</a></ins>');
        deepEqual(s.range, [1, 4]);

        s = slice(doc, 6, 11);
        equal(s.toString('ins'), '<ins>o <b>bar</b></ins>');
        deepEqual(s.range, [2, 3]);

        // Overlap opened tag
        s = slice(doc, 2, 11);
        equal(s.toString('ins'), '<ins>a </ins><a><ins>foo <b>bar</b></ins>');
        deepEqual(s.range, [1, 3]);

        // Overlap two opened tag
        s = slice(doc, 2, 10);
        equal(s.toString('ins'), '<ins>a </ins><a><ins>foo </ins><b><ins>ba</ins>');
        deepEqual(s.range, [1, 2]);

        // Overlap closed tag
        s = slice(doc, 8, 15);
        equal(s.toString('ins'), '<ins><b>bar</b> baz</ins>');
        deepEqual(s.range, [2, 3]);
    });

    it('slice on tag edge', () => {
        // Touching tag edges at the beginning of range
        let doc = parse('<div>aaa <a><c>foo <b>bar</b> baz</c></a> bbb</div>');
        let s = slice(doc, 4, 11);
        equal(s.toString('ins'), '<ins>foo <b>bar</b></ins>');
        deepEqual(s.range, [3, 4]);

        doc = parse('<div>aaa <a><c>foo <b>bar</b></c> baz</a> bbb</div>');
        s = slice(doc, 4, 11);
        equal(s.toString('ins'), '<ins><c>foo <b>bar</b></c></ins>');
        deepEqual(s.range, [2, 5]);

        // Touching tag edges at the end of range
        s = slice(doc, 0, 11);
        equal(s.toString('ins'), '<ins>aaa </ins><a><ins><c>foo <b>bar</b></c></ins>');
        deepEqual(s.range, [1, 5]);
    });

    it('fragment', () => {
        const doc = parse('<div>aaa <a><c>foo <b>bar</b> baz</c></a> bbb</div>');

        let s = fragment(doc, 8, 11);
        equal(s.toString('del'), '<del><div><a><c><b>bar</b></c></a></div></del>');
        deepEqual(s.range, [3, 4]);

        s = fragment(doc, 2, 11);
        equal(s.toString('del'), '<del><div>a <a><c>foo <b>bar</b></c></a></div></del>');
        deepEqual(s.range, [1, 4]);

        s = fragment(doc, 0, 11);
        equal(s.toString('del'), '<del><div>aaa <a><c>foo <b>bar</b></c></a></div></del>');
        deepEqual(s.range, [0, 4]);

        s = fragment(doc, 4, 15);
        equal(s.toString('del'), '<del><div><a><c>foo <b>bar</b> baz</c></a></div></del>');
        deepEqual(s.range, [1, 6]);
    });

    it('fragment with tag filter', () => {
        const doc = parse('<div>aaa <a><c>foo <b>bar</b> baz</c></a> bbb</div>');
        let s = fragment(doc, 8, 11, { tags: ['a', 'b'] });
        equal(s.toString('del'), '<del><a><b>bar</b></a></del>');
        deepEqual(s.range, [3, 4]);

        s = fragment(doc, 8, 11, { tags: [] });
        equal(s.toString('del'), '<del>bar</del>');
        deepEqual(s.range, [3, 4]);
    });
});