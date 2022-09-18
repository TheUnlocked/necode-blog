import { Element, Root } from 'hast';
import { Plugin } from 'unified';
import { CONTINUE, SKIP, visit } from 'unist-util-visit';
import { is } from 'unist-util-is';
import { toText } from 'hast-util-to-text';
import { fromText } from 'hast-util-from-text';
import { classnames } from 'hast-util-classnames';
import { findAndReplace } from 'hast-util-find-and-replace';

function classesOf(elt: Element): string[] {
    return (elt.properties?.className as string[] | undefined) ?? [];
}

const rehypePrismPlusExtras: Plugin<[], Root> = () => {
    return (tree, file) => visit(tree, 'element', (node, index, parent) => {
        if (!is<Element>(parent, 'element') || parent.tagName !== 'pre' ||
            node.tagName !== 'code' || !classesOf(node).includes('code-highlight')
        ) {
            return CONTINUE;
        }
        node.children.forEach((child, i) => {
            if (is<Element>(child, 'element') && child.tagName === 'span' && classesOf(child).includes('code-line')) {
                const text = toText(child, { whitespace: 'pre-wrap' });
                const parsed = text.match(/^@@(ERROR|WARN|INFO|SUCCESS|!) ?(.*)\s*$/);
                if (parsed) {
                    const [_, type, content] = parsed;
                    if (type === '!') {
                        classnames(child, 'highlight-line');
                        findAndReplace(child, /@@!/, '');
                    }
                    else {
                        fromText(child, content!);
                        const classNameToAdd = {
                            ERROR: 'intercalate-error',
                            WARN: 'intercalate-warning',
                            INFO: 'intercalate-info',
                            SUCCESS: 'intercalate-success',
                        }[type] as string;
                        classnames(child, 'code-intercalate', classNameToAdd, { 'line-number': false });
                        if (i === 0) {
                            classnames(parent, 'code-has-first-line-intercalate');
                        }

                        delete child.properties?.line;

                        for (const sibling of node.children.slice(i + 1)) {
                            if (is<Element>(sibling, 'element')) {
                                if (sibling.properties?.line) {
                                    sibling.properties.line = +sibling.properties.line - 1;
                                }
                            }
                        }
                    }
                }
            }
        });
        return SKIP
    });
};

export default rehypePrismPlusExtras;
