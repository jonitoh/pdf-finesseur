import React, { useState, createRef } from 'react';
import PropTypes from 'prop-types';
import './drop-zone.css';
import Icon from '../icon';

const DropZone = ({onFilesAdded, disabled = false, title = undefined}) => {
    const ref = createRef();
    const [highlight, setHighlight] = useState(false);

    const openFileDialog = () => {
        if (disabled) {
            return
        }
        ref.current.click();
    }

    const fileListToArray = list => {
        const array = [];
        for (var idx = 0; idx < list.length; idx++) {
            array.push(list.item(idx));
        }
        return array;
    }

    const addFiles = event => {
        if (disabled) return;
        const files = event.target.files;
        if (onFilesAdded) {
            const array = fileListToArray(files);
            onFilesAdded(array);
        }
    }

    const onDragOver = event => {
        event.preventDefault();
        if (disabled) return;
        setHighlight(true);
    };

    const onDragLeave = event => {
        setHighlight(false);
    };

    const onDrop = event => {
        event.preventDefault();
        if (disabled) return;
        const files = event.dataTransfer.files;
        if (onFilesAdded) {
            const array = fileListToArray(files);
            onFilesAdded(array);
        }
        setHighlight(false);
    }

    return (
        <div
            className={"dropzone"}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={openFileDialog}
            style={{ cursor: disabled ? "default" : "pointer" }}
        >
            <Icon.CloudUpload
                className={`icon ${highlight ? "highlight" : ""}`}
                alt="upload"
                style={{ cursor: disabled ? "default" : "pointer" }}
            />
            <input
                ref={ref}
                className="file-input"
                type="file"
                multiple
                onChange={addFiles}
            />
            {!!title ? <span>{title}</span> : null}
        </div>
    )
}

export default DropZone;

DropZone.propTypes = {
    onFilesAdded: PropTypes.func,
    disabled: PropTypes.bool,
    title: PropTypes.string
}