import { version } from 'vue';

export const isVue2 = () => {
  if (version && typeof version === 'string') {
    const majorVersionStr = version.split('.')[0];
    if (Number(majorVersionStr) === 2) {
      return true;
    }
  }
  return false;
}
