let addfilebtn = document.querySelector("#addFile");
let fileimg = document.querySelector(".fileimg");
let deleteFilebtn = document.querySelector("#deleteFile");
let openFilebtn = document.querySelector("#openFile");
let renameFilebtn = document.querySelector("#renameFile");

let divAppBody = document.querySelector("notepad");

addfilebtn.addEventListener("click", addfile);

function addfile(e, parentdiv) {
  // console.log(parentdiv);
  if (parentdiv == undefined) {
    parentdiv = homecontainer;
  }
  let fname = prompt("enter file name");
  let isname = namevalidation(fname);

  if (isname == true) {
    let pid = currentfolderid;
    resourceid++;
    resources.push({
      rid: resourceid,
      rname: fname,
      rtype: "file",
      pid: currentfolderid,
      isBold: true,
      isItalic: false,
      isUnderline: false,
      bgColor: "#000000",
      textColor: "#FFFFFF",
      fontFamily: "cursive",
      fontSize: 22,
      content: "I am a new file.",
    });
    addFileHTML(fname, resourceid, pid, parentdiv);
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

function addFileHTML(fname, resourceid, parentid, parentdiv) {
  let filetemplate = templates.content.querySelector(".file");
  let filehtml = document.importNode(filetemplate, true); // makes a copy of folder template with its child
  let fileName = filehtml.querySelector("[purpose=name]");
  let fileimage = filehtml.querySelector("[purpose=image]");
  fileName.innerHTML = fname;
  filehtml.setAttribute("rid", resourceid);
  filehtml.setAttribute("pid", parentid);
  fileimage.setAttribute("rid", resourceid);
  fileimage.setAttribute("pid", parentid);
  fileName.setAttribute("rid", resourceid);
  fileName.setAttribute("pid", parentid);
  parentdiv.appendChild(filehtml);
}

function viewFile(target) {
  let fid = target.attributes.rid.value;
  let oldcurrentfolderid = currentfolderid;
  currentfolderid = fid;

  //beautify options
  let notepaddivtemplate = templates.content.querySelector("[purpose=notepad]");
  let notepaddiv = document.importNode(notepaddivtemplate, true);
  document.getElementById("notepad").appendChild(notepaddiv);

  let notepadfilename = notepaddiv.querySelector("[purpose=filename]");
  let mypid = -1;
  for (let i = 0; i < resources.length; i++) {
    if (resources[i].rid == fid) {
      notepadfilename.innerHTML = resources[i].rname;
      mypid = resources[i].pid;
    }
  }
  // console.log(notepaddiv);
  document.getElementById("notepad").classList.add("active");

  let divAppMenuBar = notepaddiv.querySelector("[purpose=notepad-menu]");
  let divAppBody = notepaddiv.querySelector("[purpose=notepad-body]");

  let spanSave = divAppMenuBar.querySelector("[action=save]");
  let spanBold = divAppMenuBar.querySelector("[action=bold]");
  let spanItalic = divAppMenuBar.querySelector("[action=italic]");
  let spanUnderline = divAppMenuBar.querySelector("[action=underline]");
  let inputBGColor = divAppMenuBar.querySelector("[action=bg-color]");
  let inputTextColor = divAppMenuBar.querySelector("[action=fg-color]");
  let selectFontFamily = divAppMenuBar.querySelector("[action=font-family]");
  let selectFontSize = divAppMenuBar.querySelector("[action=font-size]");
  let spanDownload = divAppMenuBar.querySelector("[action=download]");
  let inputUpload = divAppMenuBar.querySelector("[action=upload]");
  let textArea = divAppBody.querySelector("textArea");

  let mysavenotepad = function () {
    let isBold = spanBold.getAttribute("pressed") == "true";
    let isItalic = spanItalic.getAttribute("pressed") == "true";
    let isUnderline = spanUnderline.getAttribute("pressed") == "true";
    let bgColor = inputBGColor.value;
    let textColor = inputTextColor.value;
    let fontFamily = selectFontFamily.value;
    let fontSize = selectFontSize.value;
    let content = textArea.value;
    saveNotepad(
      fid,
      isBold,
      isItalic,
      isUnderline,
      bgColor,
      textColor,
      fontFamily,
      fontSize,
      content
    );
  };

  let mydownloadfile = function () {
    downloadNotepad(fid, divAppMenuBar);
  };

  spanSave.addEventListener("click", mysavenotepad);
  spanBold.addEventListener("click", makeNotepadBold);
  spanItalic.addEventListener("click", makeNotepadItalic);
  spanUnderline.addEventListener("click", makeNotepadUnderline);
  inputBGColor.addEventListener("change", changeNotepadBGColor);
  inputTextColor.addEventListener("change", changeNotepadTextColor);
  selectFontFamily.addEventListener("change", changeNotepadFontFamily);
  selectFontSize.addEventListener("change", changeNotepadFontSize);
  spanDownload.addEventListener("click", mydownloadfile);
  inputUpload.addEventListener("change", uploadNotepad);

  let resource = resources.find((r) => r.rid == fid);
  spanBold.setAttribute("pressed", !resource.isBold);
  spanItalic.setAttribute("pressed", !resource.isItalic);
  spanUnderline.setAttribute("pressed", !resource.isUnderline);
  inputBGColor.value = resource.bgColor;
  inputTextColor.value = resource.textColor;
  selectFontFamily.value = resource.fontFamily;
  selectFontSize.value = resource.fontSize;
  textArea.value = resource.content;

  spanBold.dispatchEvent(new Event("click"));
  spanItalic.dispatchEvent(new Event("click"));
  spanUnderline.dispatchEvent(new Event("click"));
  inputBGColor.dispatchEvent(new Event("change"));
  inputTextColor.dispatchEvent(new Event("change"));
  selectFontFamily.dispatchEvent(new Event("change"));
  selectFontSize.dispatchEvent(new Event("change"));

  // close btn
  function closebtnfun() {
    document.getElementById("notepad").classList.remove("active");
    currentfolderid = oldcurrentfolderid;
    crossbtnview.removeEventListener("click", closebtnfun);
  }

  let crossbtnnotepad = notepaddiv.querySelector("[purpose=closebtnnotepad]");
  crossbtnnotepad.addEventListener("click", closebtnfun);
}

function renameFile(target) {
  let ridofclicked = target.attributes.rid.value;
  let rename = confirm("Do u want to rename this file");
  if (rename) {
    let filehtml = target.parentNode;
    let fnamediv = filehtml.querySelector("[purpose=name]");

    let nfname = prompt("Enter new file name");
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

function deleteFile(target) {
  // delete all folders inside also
  let filehtml = target.parentNode;
  let filehtmlparent = filehtml.parentNode;

  // html
  filehtmlparent.removeChild(filehtml);

  //ram
  let fidTBD = target.attributes.rid.value;
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

function saveNotepad(
  fid,
  isBold,
  isItalic,
  isUnderline,
  bgColor,
  textColor,
  fontFamily,
  fontSize,
  content
) {
  console.log(fid);
  let resource = resources.find((r) => r.rid == fid);
  resource.isBold = isBold;
  resource.isItalic = isItalic;
  resource.isUnderline = isUnderline;
  resource.bgColor = bgColor;
  resource.textColor = textColor;
  resource.fontFamily = fontFamily;
  resource.fontSize = fontSize;
  resource.content = content;

  saveToStorage();
}

function makeNotepadBold() {
  let textArea = this.parentNode.parentNode.querySelector("textArea");
  let isPressed = this.getAttribute("pressed") == "true";
  if (isPressed == false) {
    this.setAttribute("pressed", true);
    textArea.style.fontWeight = "bold";
  } else {
    this.setAttribute("pressed", false);
    textArea.style.fontWeight = "normal";
  }
}
function makeNotepadItalic() {
  let textArea = this.parentNode.parentNode.querySelector("textArea");
  let isPressed = this.getAttribute("pressed") == "true";
  if (isPressed == false) {
    this.setAttribute("pressed", true);
    textArea.style.fontStyle = "italic";
  } else {
    this.setAttribute("pressed", false);
    textArea.style.fontStyle = "normal";
  }
}
function makeNotepadUnderline() {
  let textArea = this.parentNode.parentNode.querySelector("textArea");
  let isPressed = this.getAttribute("pressed") == "true";
  if (isPressed == false) {
    this.setAttribute("pressed", true);
    textArea.style.textDecoration = "underline";
  } else {
    this.setAttribute("pressed", false);
    textArea.style.textDecoration = "none";
  }
}

function changeNotepadBGColor() {
  let color = this.value;
  let textArea = this.parentNode.parentNode.querySelector("textArea");
  textArea.style.backgroundColor = color;
}

function changeNotepadTextColor() {
  let color = this.value;
  let textArea = this.parentNode.parentNode.querySelector("textArea");
  textArea.style.color = color;
}

function changeNotepadFontFamily() {
  let fontFamily = this.value;
  let textArea = this.parentNode.parentNode.querySelector("textArea");
  textArea.style.fontFamily = fontFamily;
}

function changeNotepadFontSize() {
  let fontSize = this.value + "px";
  let textArea = this.parentNode.parentNode.querySelector("textArea");
  textArea.style.fontSize = fontSize;
}

function downloadNotepad(fid, divNotepadMenu) {
  let resource = resources.find((r) => r.rid == fid);

  let strForDownload = JSON.stringify(resource);
  let encodedData = encodeURIComponent(strForDownload);

  let aDownload = divNotepadMenu.querySelector("a[purpose=download]");
  aDownload.setAttribute(
    "href",
    "data:text/json; charset=utf-8, " + encodedData
  );
  aDownload.setAttribute("download", resource.rname + ".json");

  aDownload.click();
}

function uploadNotepad() {
  let file = window.event.target.files[0];
  // console.log(file);
  let reader = new FileReader();
  reader.addEventListener("load", function () {
    let data = window.event.target.result;
    let resource = JSON.parse(data);

    let spanBold = divAppMenuBar.querySelector("[action=bold]");
    let spanItalic = divAppMenuBar.querySelector("[action=italic]");
    let spanUnderline = divAppMenuBar.querySelector("[action=underline]");
    let inputBGColor = divAppMenuBar.querySelector("[action=bg-color]");
    let inputTextColor = divAppMenuBar.querySelector("[action=fg-color]");
    let selectFontFamily = divAppMenuBar.querySelector("[action=font-family]");
    let selectFontSize = divAppMenuBar.querySelector("[action=font-size]");
    let textArea = divAppBody.querySelector("textArea");

    spanBold.setAttribute("pressed", !resource.isBold);
    spanItalic.setAttribute("pressed", !resource.isItalic);
    spanUnderline.setAttribute("pressed", !resource.isUnderline);
    inputBGColor.value = resource.bgColor;
    inputTextColor.value = resource.textColor;
    selectFontFamily.value = resource.fontFamily;
    selectFontSize.value = resource.fontSize;
    textArea.value = resource.content;

    spanBold.dispatchEvent(new Event("click"));
    spanItalic.dispatchEvent(new Event("click"));
    spanUnderline.dispatchEvent(new Event("click"));
    inputBGColor.dispatchEvent(new Event("change"));
    inputTextColor.dispatchEvent(new Event("change"));
    selectFontFamily.dispatchEvent(new Event("change"));
    selectFontSize.dispatchEvent(new Event("change"));
  });

  reader.readAsText(file);
}

// for double click to view and rename
window.addEventListener("dblclick", function (e) {
  // console.log(e.target);
  let target = e.target;
  if (e.target.attributes.class != undefined) {
    var classofclicked = e.target.attributes.class.value;
  }
  if (classofclicked == "fileimg") {
    viewFile(target);
  }

  if (classofclicked == "filename") {
    renameFile(target);
  }
});

// for right click to open popup and perfom its function
window.addEventListener("contextmenu", function (e) {
  // console.log(e);
  let target = e.target;
  if (e.target.attributes.class != undefined) {
    var classofclicked = e.target.attributes.class.value;
  }

  if (classofclicked == "fileimg") {
    e.preventDefault();
    document.getElementById("context-menu").classList.remove("active");
    // console.log("right click pressed on folder");
    let ridofclicked = e.target.attributes.rid.value;
    let filecontextElement = document.getElementById("file-context-menu");
    filecontextElement.style.top = e.pageY + "px";
    filecontextElement.style.left = e.pageX + "px";
    filecontextElement.classList.add("active");

    let old_element = document.getElementById("deleteFile");
    deleteFilebtn = old_element.cloneNode(true);
    old_element.parentNode.replaceChild(deleteFilebtn, old_element);

    let dltfun = deleteFile.bind(null, target);
    deleteFilebtn.addEventListener("click", dltfun);

    old_element = document.getElementById("openFile");
    openFilebtn = old_element.cloneNode(true);
    old_element.parentNode.replaceChild(openFilebtn, old_element);

    let opnfun = viewFile.bind(null, target);
    openFilebtn.addEventListener("click", opnfun);

    old_element = document.getElementById("renameFile");
    renameFilebtn = old_element.cloneNode(true);
    old_element.parentNode.replaceChild(renameFilebtn, old_element);

    let renamefun = renameFile.bind(null, target);
    renameFilebtn.addEventListener("click", renamefun);
  }
});