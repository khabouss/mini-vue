function parse(content) {
  const templateRegex = /<template>([\s\S]*?)<\/template>/;
  const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/;
  const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/;

  const templateMatch = content.match(templateRegex);
  const template = templateMatch ? templateMatch[0].trim() : "";

  const scriptMatch = content.match(scriptRegex);
  const script = scriptMatch ? scriptMatch[0].trim() : "";

  const stylesMatch = content.match(styleRegex);
  const styles = stylesMatch ? stylesMatch[0].trim() : "";

  return {
    template,
    script,
    styles,
  };
}

function convertTemplateToRender(template) {
  const content = template.replace(/<\/?template>/g, '').trim();
  const renderFunctionBody = parseContent(content);
  return `${renderFunctionBody}`;
}

function parseContent(content) {
  return content.replace(/<(\w+)([^>]*)>(.*?)<\/\1>/gs, (match, tag, attrs, innerContent) => {
      const props = attrs.trim()
          .replace(/:(\w+)="([^"]*)"/g, '"$1": this.$2')
          .replace(/(\w+)=["']([^"']+)["']/g, '"$1": "$2"')
          .replace(/(\w+)=/g, "$1:");
      const conditionalMatch = /v-if="([^"]+)"/.exec(attrs);
      if (conditionalMatch) {
          const condition = conditionalMatch[1];
          return `${condition} ? h('${tag}', { ${props} }, [${parseContent(innerContent.trim())}]) : null`;
      }
      const innerNodes = innerContent.trim()
          ? (/<\w+/.test(innerContent) ? parseContent(innerContent.trim()) : `'${innerContent.trim()}'`)
          : '';

      return `{tag: '${tag}', props: { ${props} }${innerNodes ? `, children: [${innerNodes}]` : 'children: null'}}`;
  });
}

export default function myVuePlugin() {
  return {
    name: "custom-plugin",
    transform(code, id) {
      if (!id.endsWith(".mvue")) return;
      const descriptor = parse(code);
      const template = descriptor.template ? descriptor.template : "";
      const script = descriptor.script ? descriptor.script : "";
      const styles = descriptor.styles ? descriptor.styles : "";

      return {
        code: `
        export const vnode = ${convertTemplateToRender(template)}
        `,
      };
    },
  };
}

