import { useState } from "react";
import axios from "axios";
import { FiUpload } from "react-icons/fi";
import { MdOutlinePictureAsPdf } from "react-icons/md";
import { PiTrash } from "react-icons/pi"

export default function FileUpload({ files, setFiles, key }) {

  const [disabled, setDisabled] = useState(false)

  async function pdfSelection(e) {
    e.preventDefault()
    if (e.target.files.length > 0) {
      const pdfFile = e.target.files[0]
      // console.log(pdfFile)
      console.log("entered")

      if (pdfFile && e.target.files.length > 0) {
        console.log("test1")
        if (pdfFile.type == "application/pdf") {
          console.log("test2")
          pdfFile.isUploading = true;
          setFiles(newFiles => [...newFiles, {
            fieldname: 'files',
            originalname: pdfFile.name,
            encoding: '7bit',
            mimetype: pdfFile.type,
            size: pdfFile.size,
            URL: URL.createObjectURL(pdfFile),
            file: pdfFile,
          }]
          )

        } else {
          alert("Please upload a PDF file")

        }
      }
      console.log(files)
      console.log("exited")
    }
    if (files.length >= 1) {
      setDisabled(true)
    } else {
      setDisabled(false)
    }
    console.log(disabled)
    return 0
  }

  async function deletePdfFile(e) {
    e.preventDefault()
    const fileName = e.target.parentElement.parentElement.id.split("||")[1]
    console.log(fileName)
    const newFiles = files.filter((file, i) => file.originalname != fileName)
    setFiles(newFiles)
    setDisabled(false)
    console.log(files)
  }

  const uploadPdfFiles = (e) => {
    e.preventDefault()

    const formData = new FormData();

    for (var file of files) {
      formData.append("files", file.file, file.originalname);
      console.log("file", file)
      file.isUploading = false;
    }

    axios.post(`http://localhost:3000/upload/pdf`, formData)
      .then((res) => {
        console.log(formData)
      })
      .catch((err) => {
        console.error(err);

      })
  }


  return (<>
    <script src="https://kit.fontawesome.com/6e367c8c45.js" crossorigin="anonymous"></script>
    <div className="flex justify-start items-center gap-4">

      <div className="file-inputs justify-between items-center gap-4 p-4" style={{ display: "flex" }}>
        <div>
          <label htmlFor="pdfInput" title='choose pdf'>
            <div className="flex justify-center items-center w-16 h-16" style={{ cursor: "pointer", background: "#3D3E43", borderRadius: "100%", boxShadow: "3px 7px 10px 2px rgb(0,0,0,0.3)", color: "#F88821" }}>
              <MdOutlinePictureAsPdf style={{ fontSize: "45px" }} />
            </div>
          </label>
          <input
            type="file"
            id="pdfInput"
            key={key}
            style={{ display: "none" }}
            onChange={pdfSelection}
            disabled={disabled}
          />
        </div>
        <div>
          <label htmlFor="upPdf" title='upload file(s)'>
            <div className="flex justify-center items-center w-12 h-12" style={{ cursor: "pointer", background: "#3D3E43", borderRadius: "100%", boxShadow: "3px 7px 10px 2px rgb(0,0,0,0.3)", color: "#F88821" }}>
              <FiUpload style={{ fontSize: "25px" }} />
            </div>
          </label>
          <button id="upPdf" style={{ display: "none" }} onClick={uploadPdfFiles}></button>
        </div>
      </div>
      <div className="flex justify-start items-center flex-wrap w-fit gap-5">
        {files ? files.map((file, index) => (
          <div key={`pdfLabel||${file.originalname}`} id={`pdfLabel||${file.originalname}`} className="px-6 py-3 flex justify-between items-center" style={{ width: "17rem", background: "#3D3E43", boxShadow: "3px 7px 10px 2px rgb(0,0,0,0.3)", borderRadius: "20px", color: "white" }}>
            <div style={{ width: "10rem", overflowX: "hidden" }}>
              <h1 className="" style={{ whiteSpace: "nowrap" }}>{file.originalname}</h1>
            </div>
            <div>
              <label htmlFor="pdf-delete">
                <div className="flex justify-center items-center" style={{ cursor: "pointer" }}>
                  <PiTrash style={{ fontSize: "20px" }} />
                </div>
              </label>
              <button id='pdf-delete' onClick={deletePdfFile} style={{ display: "none" }}>
              </button>
            </div>
          </div>
        )) : ''}
      </div>
      <div>
        <h1 style={{ color: "rgb(200,200,200)", fontWeight: "bold", paddingRight:"10px" }}>{`${files.length}/2`}</h1>
      </div>
    </div>
  </>)
}
