export default function getAuthority(URL) {
  let hasPermission = false;
  let roleMap = window.CFG.map((item) => {
    return item.urls;
  });
  let roleMapLen = roleMap.length;
  for (let i = 0; i < roleMapLen; i++) {
    if (roleMap[i] === URL) {
      hasPermission = true;
      break;
    }
  }
  return hasPermission;
};
