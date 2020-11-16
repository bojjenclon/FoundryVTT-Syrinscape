export function syrinFind(id: String): any {
  let result = null;

  const library = game.settings.get('syrinscape', 'sound-library');

  const searchChildren = (children: Array<any>) => {
    for (let childIdx = 0; childIdx < children.length; childIdx++) {
      const child = children[childIdx];

      if (child.id === id) {
        result = child;
        return true;
      } else if (child.type === 'folder') {
        if (searchChildren(child.children)) {
          return true;
        }
      }
    }

    return false;
  };

  for (let i = 0; i < library.length; i++) {
    const obj = library[i];

    if (obj.id === id) {
      result = obj;
      break;
    } else if (obj.type === 'folder') {
      if (searchChildren(obj.children)) {
        break;
      }
    }
  }

  return result;
}

export function syrinUpdate(id: String, data: any, doSort: boolean = true): Array<any> {
  const library = game.settings.get('syrinscape', 'sound-library');

  const searchChildren = (children: Array<any>) => {
    for (let childIdx = 0; childIdx < children.length; childIdx++) {
      const child = children[childIdx];

      if (child.id === id) {
        children[childIdx] = mergeObject(child, data);
        return true;
      } else if (child.type === 'folder') {
        if (searchChildren(child.children)) {
          return true;
        }
      }
    }

    return false;
  };

  for (let i = 0; i < library.length; i++) {
    const obj = library[i];

    if (obj.id === id) {
      library[i] = mergeObject(obj, data);
      break;
    } else if (obj.type === 'folder') {
      if (searchChildren(obj.children)) {
        break;
      }
    }
  }

  return doSort ? syrinSort(library) : library;
}

export function syrinDelete(id: String, doSort: boolean = true): Array<any> {
  const library = game.settings.get('syrinscape', 'sound-library');

  const searchChildren = (children: Array<any>) => {
    for (let childIdx = 0; childIdx < children.length; childIdx++) {
      const child = children[childIdx];

      if (child.id === id) {
        children.splice(childIdx, 1);
        return true;
      } else if (child.type === 'folder') {
        if (searchChildren(child.children)) {
          return true;
        }
      }
    }

    return false;
  };

  for (let i = 0; i < library.length; i++) {
    const obj = library[i];

    if (obj.id === id) {
      library.splice(i, 1);
      break;
    } else if (obj.type === 'folder') {
      if (searchChildren(obj.children)) {
        break;
      }
    }
  }

  return doSort ? syrinSort(library) : library;
}

export function syrinReparent(sourceId: String, parentId: String, doSort: boolean = true): Array<any> {
  const library = game.settings.get('syrinscape', 'sound-library');

  let source: any;
  let folder: any;

  const searchChildren = (children: Array<any>) => {
    for (let childIdx = 0; childIdx < children.length; childIdx++) {
      const child = children[childIdx];

      if (child.id === sourceId) {
        source = children[childIdx];
        children.splice(childIdx--, 1);
      }

      if (child.type === 'folder') {
        if (child.id === parentId) {
          folder = child;
        }

        searchChildren(child.children);
      }
    }
  };

  for (let i = 0; i < library.length; i++) {
    const obj = library[i];

    if (obj.id === sourceId) {
      source = library[i];
      library.splice(i--, 1);
    }

    if (obj.type === 'folder') {
      if (obj.id === parentId) {
        folder = obj;
      }

      searchChildren(obj.children);
    }
  }

  if (source && folder) {
    source.parent = folder.id;
    folder.children.push(source);
  } else if (source && parentId === 'root') {
    source.parent = 'root';
    library.push(source);
  }

  return doSort ? syrinSort(library) : library;
}

export function syrinSort(library?: any) {
  if (!library) {
    library = game.settings.get('syrinscape', 'sound-library');
  }

  const sorter = (a: any, b: any): number => {
    if (a.type === 'folder' && b.type === 'sound') {
      return -1;
    } else if (a.name === b.name) {
      return a.id.localeCompare(b.id);
    }

    return a.name.localeCompare(b.name);
  };

  const doSort = (obj: any) => {
    if (Array.isArray(obj)) {
      obj.sort(sorter);

      for (let child of obj) {
        doSort(child);
      }
    } else if (obj.children) {
      obj.children.sort(sorter);

      for (let child of obj.children) {
        doSort(child);
      }
    }
  };

  doSort(library);

  return library;
}

export function syrinFilter(filter: string, library?: any) {
  if (!library) {
    library = game.settings.get('syrinscape', 'sound-library');
  }

  const regex = new RegExp(filter, 'gi');

  let parentList = [];
  const searchChildren = (children: Array<any>) => {
    for (let childIdx = 0; childIdx < children.length; childIdx++) {
      const child = children[childIdx];

      child.visible = false;

      if (regex.test(child.name)) {
        child.visible = true;
        parentList.forEach(p => p.visible = true);

        return true;
      } else if (child.type === 'folder') {
        parentList.push(child);

        searchChildren(child.children);

        parentList.pop();
      }
    }

    return false;
  };

  for (let i = 0; i < library.length; i++) {
    const obj = library[i];

    obj.visible = false;

    if (regex.test(obj.name)) {
      obj.visible = true;
      parentList.forEach(p => p.visible = true);

      break;
    } else if (obj.type === 'folder') {
      parentList.push(obj);

      searchChildren(obj.children);

      parentList.pop();
    }
  }

  return library;
}
