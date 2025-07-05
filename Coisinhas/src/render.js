import { objectType, mediaInHTML } from "./renderMedia.js"
import { addMedia } from "./req.js";

export default 
async function render() {
  const container = document.querySelector(".bigContainer");
  const response = await fetch('https://assistidinhos.onrender.com/api/assistidos');
  const data = await response.json();

  objectType.forEach((element) => {
    container.innerHTML += `
      <div class="container"> 
        <div class="divH1">
          <h1>${element.title}</h1>
          <div class="add" data-category="${element.category}">
            <img class="imgPlus" src="./midias/plus.png">
          </div>
        </div>
        <div class="containerBox ${element.category}"></div>
      </div>
    `;
  });

  objectType.forEach((element) => {
    const btn = document.querySelector(`.add[data-category="${element.category}"]`);
    btn?.addEventListener("click", () => addMedia(element.category));
  });
  objectType.forEach(({ category }) => {
  const dropZone = document.querySelector(`.${category}`);
  
  dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.classList.add("drag-hover");
  });

  dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("drag-hover");
  });

  dropZone.addEventListener("drop", async (e) => {
    e.preventDefault();
    dropZone.classList.remove("drag-hover");

    const id = e.dataTransfer.getData("text/plain");
    if (!id) return;

    try {
       const response = await fetch(`https://assistidinhos.onrender.com/api/assistidos/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ category }),
      });


    if (!response.ok) throw new Error("Erro ao mover mídia");
    const draggedElement = document.querySelector(`.box[data-id="${id}"]`);
    const newContainer = document.querySelector(`.${category}`);

    if (draggedElement && newContainer) {
    newContainer.appendChild(draggedElement);
    }
    } catch (err) {
      console.error("Erro ao mover card:", err);
      alert("Erro ao mover card");
    }
  });
});

  await mediaInHTML(data);
}
