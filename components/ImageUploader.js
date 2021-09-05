import { useState } from "react";
import { auth, storage, STATE_CHANGED } from "@lib/firebase";

export default function ImageUploader({ setImgURL, placeholder }) {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [fileName, setFileName] = useState("");

    const uploadFile = async (e) => {
        const file = Array.from(e.target.files)[0];
        const extension = file.type.split("/")[1];

        setFileName(file.name);

        const ref = storage.ref(
            `uploads/${auth.currentUser.uid}/${Date.now()}.${extension}`
        );

        setUploading(true);

        const task = ref.put(file);
        task.on(STATE_CHANGED, (snapshot) => {
            const pct = (
                (snapshot.bytesTransferred / snapshot.totalBytes) *
                100
            ).toFixed(0);
            setProgress(pct);
            task.then((d) => ref.getDownloadURL()).then((url) => {
                setImgURL(url);
                setUploading(false);
            });
        });
    };

    if (fileName != "") {
        return (
            <div className="imageUploader">
                <label htmlFor="imageUploader">{fileName}</label>
                <input
                    id="imageUploader"
                    type="file"
                    onChange={uploadFile}
                    accept="img/x-png,image/gif,image/jpeg"
                />
            </div>
        );
    }

    return (
        <>
            {uploading && <h3>uploading.. {progress}%</h3>}
            {!uploading && (
                <div className="imageUploader">
                    <label htmlFor="imageUploader">
                        {typeof placeholder !== "undefined"
                            ? placeholder
                            : "IMG UPLOAD"}
                    </label>
                    <input
                        id="imageUploader"
                        type="file"
                        onChange={uploadFile}
                        accept="img/x-png,image/gif,image/jpeg"
                    />
                </div>
            )}
        </>
    );
}
