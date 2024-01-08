import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "react-quill/dist/quill.bubble.css";

import "./TextEditor.css";

interface Props {
  callback: (val: string) => void;
  text?: string;
  readOnly?: boolean;
}

const TextEditor = ({ callback, text, readOnly = false }: Props) => {
  const value = useRef(text ?? "");

  var toolbarOptions = [
    ["bold", "italic", "underline", "strike"], // toggled buttons
    ["blockquote", "code-block"],

    // [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ list: "ordered" }, { list: "bullet" }],
    [{ script: "sub" }, { script: "super" }], // superscript/subscript
    [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
    [{ direction: "rtl" }], // text direction

    // [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ header: [1, 2, 3, 4, 5, 6, false] }],

    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    [{ font: [] }],
    [{ align: [] }],

    ["clean"], // remove formatting button
  ];

  let modules = {
    toolbar: toolbarOptions,
  };

  const handleQuillChang = (val: string) => {
    // setValue(val);
    value.current = val;
    callback(val);
  };

  return (
    <>
      {readOnly ? (
        <ReactQuill
          readOnly={readOnly}
          modules={modules}
          theme="bubble"
          value={value.current}
          onChange={handleQuillChang}
        />
      ) : (
        <ReactQuill
          modules={modules}
          theme="snow"
          value={value.current}
          onChange={handleQuillChang}
        />
      )}
    </>
  );
};

export default TextEditor;
