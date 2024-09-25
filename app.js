let container = document.querySelector(".container");
let header_content = document.querySelector(".header_content");
let all_selected=document.querySelector(".all_selected")
let selectedFilters = [];
let clear_all_btn=document.querySelector(".clear_all");
// Fetch the JSON data
let dataArray = [];
const fetchFile = () => {
  fetch("data.json")
    .then((res) => res.json())
    .then((data) => {
      dataArray = data;
      createAllMembers();
    })
    .catch((error) => console.error("Error fetching data:", error));
};
fetchFile();

const createAllMembers = () => {
  if (dataArray.length > 0) {
    dataArray.forEach((item) => {
      const parentElement = document.createElement("div");
      parentElement.classList.add("only_applyed");

      parentElement.innerHTML = `
        <img src="${item.logo}" alt="${item.company}">
        <div class="info">
          <div class="header_info">
            <h2>${item.company}</h2>
            ${item.new ? `<span class="new_tag">NEW!</span>` : ""}
            ${item.featured ? `<span class="featured_tag">FEATURED</span>` : ""}
          </div>
          <h1>${item.position}</h1>
          <ul>
            <li><a href="#">${item.postedAt}</a></li>
            <li><a href="#">${item.contract}</a></li>
            <li><a href="#">${item.location}</a></li>
          </ul>
        </div>
        <div class="selected_btns">
          <button>${item.role}</button>
          <button>${item.level}</button>
        </div>
      `;

      const languages = item.languages || [];
      const tools = item.tools || [];
      const selectedBtnDiv = parentElement.querySelector(".selected_btns");

 
      languages.forEach((language) => {
        const languageButton = document.createElement("button");
        languageButton.textContent = language;
        selectedBtnDiv.appendChild(languageButton);
      });

      tools.forEach((tool) => {
        const toolButton = document.createElement("button");
        toolButton.textContent = tool;
        selectedBtnDiv.appendChild(toolButton);
      });

   
      selectedBtnDiv.querySelectorAll("button").forEach((btn) => {
        btn.onclick = (e) => {
          const filterText = e.target.textContent;

       
          if (!selectedFilters.includes(filterText)) {
            selectedFilters.push(filterText);
            header_content.style.display = "flex";

       
            const filterElement = document.createElement("div");
            filterElement.classList.add("only_selected");
            filterElement.innerHTML = `
              <h1>${filterText}</h1>
              <img src="images/icon-remove.svg" alt="Remove">
            `;
            all_selected.appendChild(filterElement);

        
            filterElement.querySelector("img").onclick = () => {
                all_selected.removeChild(filterElement);
              selectedFilters = selectedFilters.filter(
                (filter) => filter !== filterText
              );
              filterJobs();

              if (selectedFilters.length === 0) {
                header_content.style.display = "none";
              }
            };

            filterJobs();
          }
        };
      });


      container.appendChild(parentElement);
    });
  }
};


const filterJobs = () => {
  container.querySelectorAll(".only_applyed").forEach((listing, index) => {
    const job = dataArray[index];
    const jobFilters = [
      job.role,
      job.level,
      ...(job.languages || []),
      ...(job.tools || []),
    ];


    const matches = selectedFilters.every((filter) =>
      jobFilters.includes(filter)
    );

    if (matches) {
      listing.style.display = "flex";
    } else {
      listing.style.display = "none";
    }
  });
};
clear_all_btn.onclick=()=>{
    selectedFilters.splice(0);
    filterJobs();
    header_content.style.display="none";
    all_selected.innerHTML="";
}