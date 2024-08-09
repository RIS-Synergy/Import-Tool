// export async function awaitAllPromises(obj: any): Promise<any> {
//   if (obj instanceof Promise) {
//     return await obj;
//   } else if (Array.isArray(obj)) {
//     return Promise.all(obj.map(awaitAllPromises));
//   } else if (obj && typeof obj === 'object') {
//     const keys = Object.keys(obj);
//     for (const key of keys) {
//       obj[key] = await awaitAllPromises(obj[key]);
//     }
//   }
//   return obj;
// }

import * as Bluebird from 'bluebird';

export async function awaitAllPromises(obj: any): Promise<any> {
  if (Array.isArray(obj)) {
    return Bluebird.map(obj, awaitAllPromises);
  } else if (obj && typeof obj === 'object' && obj.constructor === Object) {
    return Bluebird.props(obj).then(async resolvedObj => {
      const keys = Object.keys(resolvedObj);
      for (const key of keys) {
        resolvedObj[key] = await awaitAllPromises(resolvedObj[key]);
      }
      return resolvedObj;
    });
  } else if (obj instanceof Promise) {
    return await obj;
  }
  return obj;
}

export async function allPromisesNested(obj) {
  if (Array.isArray(obj)) {
    return Promise.all(obj.map(allPromisesNested));
  } else if (obj !== null && typeof obj === 'object') {
    const entries = Object.entries(obj);
    const resolvedEntries = await Promise.all(entries.map(async ([key, value]) => {
      return [key, await allPromisesNested(value)];
    }));
    return Object.fromEntries(resolvedEntries);
  } else {
    return obj;
  }
}
