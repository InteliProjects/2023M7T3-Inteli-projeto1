import { useState } from "react";
import styles from '@/styles/FileUpload.module.css'
import axios from "axios";
import ReactDOM from 'react-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faFontAwesome } from '@fortawesome/free-brands-svg-icons'
import { faFilePdf } from "@fortawesome/free-solid-svg-icons";


export default function FileUpload({files, setFiles, removeFile, endpoint}) {
    const uploadHandler = (e) => {
        const file = e.target.files[0];
        file.isUploading = true;
        setFiles([...files, file]);

        const formData = new FormData();
        formData.append('files', file);

        axios.post(`http://localhost:3000/${endpoint}`, formData)
        .then((res) => {
            file.isUploading = false;
            setFiles([...files, file]);
        })
        .catch((err) => {
            console.error(err);
            removeFile(file.name);
        })

    }
    return(<>
        <script src="https://kit.fontawesome.com/6e367c8c45.js" crossorigin="anonymous"></script>
        <div className="file-card">
      <div className="file-inputs">
        <label htmlFor="fileInput" >
        <button style={{ backgroundColor: "white", borderRadius: "50%", "padding": "20px", "cursor": "pointer" }}>
          <FontAwesomeIcon icon={faFilePdf} style={{ width: '30px' }} />
        </button>
        </label>
        <input
          type="file"
          id="fileInput    "
          style={{ display: 'none' }}
          onChange={uploadHandler}
        />
      </div>
    </div>


    </>)
}
