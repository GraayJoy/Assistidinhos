import {finish, updateCategory, delMedia, putMedia, editMedia, addMedia, getMedia } from "./req.js";

const objectType = [
    {title: "Assistidos", category:"assistido" },
    {title: "Assistindo", category: "assistindo"},
    {title: " Para Assistir", category: "paraAssistir" }]

async function mediaInHTML(medias) {
  const assistidos = document.querySelector(".assistido");
  const assistindo = document.querySelector(".assistindo");
  const paraAssistir = document.querySelector(".paraAssistir");

  try {
    medias.sort((a, b) => a.id - b.id);

    medias.forEach((element) => {
      const box = document.createElement("div");
      box.classList.add("box");
      box.setAttribute("draggable", true);
      box.setAttribute("data-id", element.id);
      box.setAttribute("data-category", element.category);
      box.innerHTML = `
        <div class="divImg">
          <img src="${element.image}" />
        </div> 
        <div class="divH2">
          <h2>${element.name}</h2>
        </div>
      `;

      box.addEventListener("click", () => editMedia(element.id, element.image, element.name));
      box.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", element.id);
      });

      if (element.category === "assistido") assistidos.appendChild(box);
      else if (element.category === "assistindo") assistindo.appendChild(box);
      else if (element.category === "paraAssistir") paraAssistir.appendChild(box);
    });

    objectType.forEach(({ category }) => {
      const container = document.querySelector(`.${category}`);

      container.addEventListener("dragover", (e) => {
        e.preventDefault();
        container.style.backgroundColor = "#f0f0f0";
      });

      container.addEventListener("dragleave", () => {
        container.style.backgroundColor = "";
      });

      container.addEventListener("drop", async (e) => {
        e.preventDefault();
        container.style.backgroundColor = "";

        const draggedId = e.dataTransfer.getData("text/plain");
        if (!draggedId) return;

        await updateCategory(draggedId, category);
        
      });
    });

  } catch (err) {
    console.error("Erro ao carregar mídias no HTML:", err);
  }
};

function appendMediaToDOM(media) {
  const container = document.querySelector(`.${media.category}`);
  const box = document.createElement("div");
  box.classList.add("box");
  box.setAttribute("draggable", true);
  box.setAttribute("data-id", media.id);

  box.innerHTML = `
    <div class="divImg">
      <img src="${media.image}" />
    </div> 
    <div class="divH2">
      <h2>${media.name}</h2>
    </div>
  `;

  box.addEventListener("click", () => editMedia(media.id, media.image, media.name));
  box.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/plain", media.id);
  });

  container.appendChild(box);
};

function updateMediaInDOM(id, newData) {
  const box = document.querySelector(`.box[data-id="${id}"]`);
  if (!box) return;

  box.querySelector("img").src = newData.image;
  box.querySelector("h2").textContent = newData.name;
};


export {objectType, mediaInHTML, appendMediaToDOM, updateMediaInDOM};