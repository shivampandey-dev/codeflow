// src/store/uploadStore.js
let _uploadedTree = null;

export function setUploadedTree(tree) {
    _uploadedTree = tree;
}

export function getUploadedTree() {
    return _uploadedTree;
}

export function clearUploadedTree() {
    _uploadedTree = null;
}