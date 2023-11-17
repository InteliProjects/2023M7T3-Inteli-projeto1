import React from 'react';
import { ChangeEvent, FormEvent, useState } from 'react';
import axios from 'axios';
import { PiFileAudioBold, PiTrash } from 'react-icons/pi';

import toast from 'react-hot-toast';

import styles from './styles.module.scss';

interface FileUploadProps {
  uploadedAudio: string | null;
  setUploadedAudio: (string: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = (props) => {
  const [file, setFile] = useState<File>();
  const [loading, setLoading] = useState(false);

  const uploadAudio = async (event: FormEvent) => {
    event.preventDefault();
    
    if (!file) {
      toast.error('Por favor, selecione um arquivo FLAC válido.');
      return;
    }
    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(
        'http://localhost:3000/uploads/audio',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      props.setUploadedAudio(URL.createObjectURL(file));

      setLoading(false);
      toast.success('Upload realizado com sucesso!');
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      if (file) {
        setFile(file);
        toast.success('Arquivo selecionado com sucesso');
      } else {
        toast.error('Por favor, selecione um arquivo FLAC válido.');
      }
    }
  };

  return (
    <form className={styles.form}>
      <div className={styles.upload}>
        <input
          id="file-upload"
          type="file"
          accept=".flac"
          onChange={handleFileChange}
        />
        {file ? (
          <div>
            <label htmlFor="file-upload" className={styles.uploaded}>
              {file.name}
            </label>
            <PiTrash
              onClick={() => {
                setFile(undefined);
              }}
              size={25}
              fill="#F88821"
            />
          </div>
        ) : (
          <div>
            <label htmlFor="file-upload">Upload Audio</label>
            <PiFileAudioBold size={25} fill="#F88821" />
          </div>
        )}
      </div>
      <button type="submit" className={styles.submit} onClick={uploadAudio}>
        {loading ? 'Enviando...' : 'Enviar'}
      </button>
    </form>
  );
};

export default FileUpload;
