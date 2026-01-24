(async () => {
  const src = browser.runtime.getURL("scripts/control-buttons.js");
  const contentMain = await import(src);
  contentMain.main();
})();
