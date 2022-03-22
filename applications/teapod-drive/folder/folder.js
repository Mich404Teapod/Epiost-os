let addfolderbtn = document.querySelector("#addFolder");
let homecontainer = document.querySelector("#homecontainer");
let templates = document.querySelector("#templates");
let folderimg = document.querySelector(".fimg");
let deleteFolderbtn = document.querySelector("#deleteFolder");
let openFolderbtn = document.querySelector("#openFolder");
let renameFolderbtn = document.querySelector("#renameFolder");
let crossbtnview = document.querySelector("#closebtn");
let viewcontainer = document.querySelector("#view-container");
let breadcrumdiv = document.querySelector("#breadcrum");

addfolderbtn.addEventListener("click", addfolder);

function addfolder(e, parentdiv) {
  // console.log(parentdiv);
  if (parentdiv == undefined) {
    parentdiv = homecontainer;
  }
  let fname = prompt("enter BlackFolder name");
  let isname = namevalidation(fname);

  if (isname == true) {
    let pid = currentfolderid;
    resourceid++;
    resources.push({
      rid: resourceid,
      rname: fname,
      rtype: "folder",
      pid: currentfolderid,
    });
    addFolderHTML(fname, resourceid, pid, parentdiv);
    saveToStorage();
  }
}

function namevalidation(fname) {
  if (fname != null) {
    fname = fname.trim();
  }

  if (!fname) {
    // empty name validation
    alert("Empty name is not allowed.");
    return false;
  }

  // uniqueness validation
  let alreadyExists = resources.some(
    (r) => r.rname == fname && r.pid == currentfolderid
  );
  if (alreadyExists == true) {
    alert(fname + " is already in use. Try some other name");
    return false;
  }

  return true;
}

function addFolderHTML(fname, resourceid, parentid, parentdiv) {
  let foldertemplate = templates.content.querySelector(".folder");
  let folderhtml = document.importNode(foldertemplate, true); // makes a copy of folder template with its child
  let folderName = folderhtml.querySelector("[purpose=name]");
  let folderimage = folderhtml.querySelector("[purpose=image]");
  folderName.innerHTML = fname;
  folderhtml.setAttribute("rid", resourceid);
  folderhtml.setAttribute("pid", parentid);
  folderimage.setAttribute("rid", resourceid);
  folderimage.setAttribute("pid", parentid);
  folderName.setAttribute("rid", resourceid);
  folderName.setAttribute("pid", parentid);
  parentdiv.appendChild(folderhtml);
}

function viewFolder(target, flag) {
  let ridofclicked = target.attributes.rid.value;
  let view = document.querySelector("#view");
  let viewfoldername = document.querySelector("#foldername");
  let mypid = -1;
  for (let i = 0; i < resources.length; i++) {
    if (resources[i].rid == ridofclicked) {
      viewfoldername.innerHTML = resources[i].rname;
      mypid = resources[i].pid;
    }
  }
  view.classList.add("active");

  let oldcurrentfolderid = currentfolderid;
  currentfolderid = ridofclicked;
  viewcontainer.innerHTML = null;
  for (let i = 0; i < resources.length; i++) {
    if (resources[i].pid == currentfolderid && resources[i].rtype == "folder") {
      addFolderHTML(
        resources[i].rname,
        resources[i].rid,
        resources[i].pid,
        viewcontainer
      );
    } else if (
      resources[i].pid == currentfolderid &&
      resources[i].rtype == "file"
    ) {
      addFileHTML(
        resources[i].rname,
        resources[i].rid,
        resources[i].pid,
        viewcontainer
      );
    }
  }

  function addfbtn(e) {
    // console.log("curr fid is :- ", currentfolderid);
    addfolder(e, viewcontainer);
  }

  function addfilebtnfn(e) {
    // console.log("curr fid is :- ", currentfolderid);
    addfile(e, viewcontainer);
  }

  let old_element = document.getElementById("addFolder");
  addfolderbtn = old_element.cloneNode(true);
  old_element.parentNode.replaceChild(addfolderbtn, old_element);

  addfolderbtn.addEventListener("click", addfbtn);

  old_element = document.getElementById("addFile");
  addfilebtn = old_element.cloneNode(true);
  old_element.parentNode.replaceChild(addfilebtn, old_element);

  addfilebtn.addEventListener("click", addfilebtnfn);

  function closebtnfun() {
    // console.log(currentfolderid);
    document.getElementById("view").classList.remove("active");
    currentfolderid = oldcurrentfolderid;
    crossbtnview.removeEventListener("click", closebtnfun);
    addfolderbtn.removeEventListener("click", addfbtn);
    addfolderbtn.addEventListener("click", addfolder);
    addfilebtn.removeEventListener("click", addfilebtnfn);
    addfilebtn.addEventListener("click", addfile);
  }

  crossbtnview.addEventListener("click", closebtnfun);

  //setting up breadcrum
  if (flag == undefined || flag == true) {
    let breadcrumitem = templates.content.querySelector(".breadcrum-item");
    let breadcrumitemhtml = document.importNode(breadcrumitem, true);
    breadcrumitemhtml.innerHTML = viewfoldername.innerHTML;
    breadcrumitemhtml.setAttribute("rid", ridofclicked);
    breadcrumitemhtml.setAttribute("pid", mypid);
    if (mypid == -1) breadcrumdiv.innerHTML = null;

    let breadcrumdivchildnodes = breadcrumdiv.childNodes;
    for (let i = breadcrumdivchildnodes.length - 1; i >= 0; i--) {
      let cn = breadcrumdivchildnodes[i];
      if (cn.getAttribute("rid") != mypid) {
        breadcrumdiv.removeChild(cn);
      } else {
        break;
      }
    }

    breadcrumdiv.appendChild(breadcrumitemhtml);

    function vf(event) {
      // console.log("bread crum item clicked");
      // console.log(event.target);
      viewFolder(event.target, false);
    }

    breadcrumitemhtml.addEventListener("click", vf);
  }
}

function renameFolder(target) {
  let ridofclicked = target.attributes.rid.value;
  let rename = confirm("Do u want to rename this folder");
  if (rename) {
    let folderhtml = target.parentNode;
    let fnamediv = folderhtml.querySelector("[purpose=name]");

    let nfname = prompt("Enter new folder name");
    let isname = namevalidation(nfname);
    if (isname == true) {
      fnamediv.innerHTML = nfname;
      for (let i = 0; i < resources.length; i++) {
        if (resources[i].rid == ridofclicked) {
          resources[i].rname = nfname;
        }
      }

      saveToStorage();
    }
  }
}

function deleteFolder(target) {
  // delete all folders inside also
  let folderhtml = target.parentNode;
  let folderhtmlparent = folderhtml.parentNode;
  // console.log(folderhtmlparent);
  let fnamediv = folderhtml.querySelector("[purpose=name]");
  let fname = fnamediv.innerHTML;

  let fidTBD = target.attributes.rid.value;

  let childrenExists = resources.some((r) => r.pid == fidTBD);
  let sure = confirm(
    `Are you sure you want to delete ${fname}?` +
      (childrenExists ? ". It also has children." : "")
  );
  if (!sure) {
    return;
  }

  // html
  folderhtmlparent.removeChild(folderhtml);
  // ram
  deleteHelper(fidTBD);

  //  storage
  saveToStorage();
}

function deleteHelper(fidTBD) {
  let children = resources.filter((r) => r.pid == fidTBD);
  for (let i = 0; i < children.length; i++) {
    deleteHelper(children[i].rid); // this is capable of delete children and their children recursively
  }

  let ridx = resources.findIndex((r) => r.rid == fidTBD);
  resources.splice(ridx, 1);
}

// for double click to view and rename
window.addEventListener("dblclick", function (e) {
  // console.log(e.target);
  let target = e.target;
  if (e.target.attributes.class != undefined) {
    var classofclicked = e.target.attributes.class.value;
  }
  if (classofclicked == "fimg") {
    viewFolder(target);
  }

  if (classofclicked == "fname") {
    renameFolder(target);
  }
});

// for right click to open popup and perfom its function
window.addEventListener("contextmenu", function (e) {
  // console.log(e);
  let target = e.target;
  if (e.target.attributes.class != undefined) {
    var classofclicked = e.target.attributes.class.value;
  }

  if (classofclicked == "fimg") {
    e.preventDefault();
    document.getElementById("context-menu").classList.remove("active");
    // console.log("right click pressed on folder");
    let ridofclicked = e.target.attributes.rid.value;
    let foldercontextElement = document.getElementById("folder-context-menu");
    foldercontextElement.style.top = e.pageY + "px";
    foldercontextElement.style.left = e.pageX + "px";
    foldercontextElement.classList.add("active");

    let old_element = document.getElementById("deleteFolder");
    deleteFolderbtn = old_element.cloneNode(true);
    old_element.parentNode.replaceChild(deleteFolderbtn, old_element);

    let dltfun = deleteFolder.bind(null, target);
    deleteFolderbtn.addEventListener("click", dltfun);

    old_element = document.getElementById("openFolder");
    openFolderbtn = old_element.cloneNode(true);
    old_element.parentNode.replaceChild(openFolderbtn, old_element);

    let opnfun = viewFolder.bind(null, target);
    openFolderbtn.addEventListener("click", opnfun);

    old_element = document.getElementById("renameFolder");
    renameFolderbtn = old_element.cloneNode(true);
    old_element.parentNode.replaceChild(renameFolderbtn, old_element);

    let renamefun = renameFolder.bind(null, target);
    renameFolderbtn.addEventListener("click", renamefun);
  }
});
