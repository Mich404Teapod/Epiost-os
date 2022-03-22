function saveToStorage() {
  let rjson = JSON.stringify(resources); // used to convert jso to a json string which can be saved
  localStorage.setItem("data", rjson);
}

function loadFromStorage() {
  let rjson = localStorage.getItem("data");
  if (!rjson) {
    return;
  }

  resources = JSON.parse(rjson);
  for (let i = 0; i < resources.length; i++) {
    if (resources[i].pid == currentfolderid) {
      if (resources[i].rtype == "folder") {
        addFolderHTML(
          resources[i].rname,
          resources[i].rid,
          resources[i].pid,
          homecontainer
        );
      } else if (resources[i].rtype == "file") {
        addFileHTML(
          resources[i].rname,
          resources[i].rid,
          resources[i].pid,
          homecontainer
        );
      }
    }

    if (resources[i].rid > resourceid) {
      resourceid = resources[i].rid;
    }
  }
}

loadFromStorage();