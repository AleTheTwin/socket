async function selectionFrame(name, ip) {
    let modalContainer = document.getElementById('modal-content')
    modalContainer.innerHTML = '\
    <div id="device-selected" class="device-selected">\
        <div class="device-card">\
            <div class="card-content">\
                <div class=" avatar avatar-card" id="device-selected-avatar"></div>\
                <div class="device-info">\
                    <div class="info info-card">\
                        <h1 id="device-selected-name"></h1>\
                        <small id="device-selected-ip"></small>\
                    </div>\
                </div>\
            </div>\
            <div id="select-container" class="select-file"></div>\
        </div>\
    </div>\
    '
    let avatar = document.getElementById(name + '-avatar').innerHTML
    document.getElementById('device-selected-name').innerHTML = name
    document.getElementById('device-selected-ip').innerHTML = ip
    document.getElementById('device-selected-avatar').innerHTML = avatar
    openModal()
    // let card = document.getElementById(name + "-card")
    // let container = document.getElementById('device-container')
    let selectionContainer = document.getElementById('select-container')

    
    // container.removeChild(card)

    // selectionFrame.appendChild(card)
    // let selectionContainer = selectionFrame.getElementsByClassName('select-file')[0]
    await sleep(750)
    selectionContainer.classList.add('select-file-space')
    await sleep(750)
    let selectionContent = '\
    <div class="drag-and-drop" id="drag-and-drop"><p>Drag your file and drop it here</p></div>\
    <small id="path-to-file"></small>\
    <div class="btn btn-select">\
    <form id="file-form" action="http://' + ip + ':3000' + '/upload" method="post" enctype="multipart/form-data">\
        <input class="visually-hidden" type="file" name="file" id="input-file" multiple>\
        <label for="input-file">Select file 📁</label>\
    </form>\
    </div>\
    <div class="device-info btn btn-send" onclick="sendFile()">\
        <div class="info info-card">\
            <h1>Send file</h1>\
        </div>\
    </div>'
    selectionContainer.innerHTML = selectionContent

    let input = document.getElementById('input-file')

    input.onchange = function(e) { 
        let files = input.files
        let text = ""
        for(let i = 0; i < files.length; i++) {
            if(i > 0) {
                text += "<br>"
            }
            if(i > 5) {
                text += "more..."
                break
            } else {
                text += "📁 " + (files[i].name.slice(0,20)) + (files[i].name.length > 20 ? "..." : "")
            }
                
        }

        document.getElementById('path-to-file').innerHTML = text
    }

    let dropZone = document.getElementById('drag-and-drop')

    // dropZone.addEventListener('dragover', function(e) {
    //     e.stopPropagation();
    //     e.preventDefault();
    //     e.dataTransfer.dropEffect = 'copy';
    // });
    dropZone.ondragover = dropZone.ondragenter = function(evt) {
        evt.preventDefault();
      };
      
      dropZone.ondrop = function(evt) {
        // pretty simple -- but not for IE :(
        input.files = evt.dataTransfer.files;
        
        let files = input.files
        let text = ""
        for(let i = 0; i < files.length; i++) {
            if(i > 0) {
                text += "<br>"
            }
            if(i > 5) {
                text += "more..."
                break
            } else {
                text += "📁 " + (files[i].name.slice(0,20)) + (files[i].name.length > 20 ? "..." : "")
            }
                
        }

        document.getElementById('path-to-file').innerHTML = text
        // If you want to use some of the dropped files
        // const dT = new DataTransfer();
        // dT.items.add(evt.dataTransfer.files[0]);
        // dT.items.add(evt.dataTransfer.files[3]);
        // input.files = dT.files;
      
        evt.preventDefault();
      };
}

function closeModal() {
    let modal = document.getElementById('modal')
    let modalShadow = document.getElementById('modal-shadow')
    modal.classList.add('visually-hidden')
    modalShadow.classList.remove('modal-shadow')
}

function openModal() {
    let modal = document.getElementById('modal')
    let modalShadow = document.getElementById('modal-shadow')
    modal.classList.remove('visually-hidden')
    modalShadow.classList.add('modal-shadow')
}

function sendFile() {
    let form = document.getElementById('file-form')
    form.submit()
}