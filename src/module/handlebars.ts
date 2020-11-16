export default function registerHandlebars() {
  Handlebars.registerHelper('empty', arr => arr.length === 0);
  Handlebars.registerHelper('isChildOf', (sourceId, parentId) => {
    let result = false;
    const library = game.settings.get('syrinscape', 'sound-library');

    let parentList = [];
    const searchChildren = (children: Array<any>) => {
      for (let childIdx = 0; childIdx < children.length; childIdx++) {
        const child = children[childIdx];

        if (child.id === sourceId) {
          result = parentList.includes(parentId);
          return true;
        } else if (child.type === 'folder') {
          parentList.push(child.id);

          if (searchChildren(child.children)) {
            return true;
          }

          parentList.pop();
        }
      }

      return false;
    };

    for (let i = 0; i < library.length; i++) {
      const obj = library[i];

      if (obj.id === sourceId) {
        break;
      } else if (obj.type === 'folder') {
        parentList.push(obj.id);

        if (searchChildren(obj.children)) {
          break;
        }

        parentList.pop();
      }
    }

    return result;
  });
}