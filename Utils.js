let createElementAndAppendToParent = (options) => {
  let { elementTag, className, content, parentElement } = options;

  let ele = document.createElement(elementTag);
  ele.classList.add(className);
  ele.innerText = content;
  parentElement.append(ele);
};

let showError = (errorOptions) => {
  let errorContainer = errorOptions.parentElement;
  if (errorContainer.children.length > 0) {
    errorContainer.innerText = "";
  }
  if (errorContainer.classList.contains("hide")) {
    errorContainer.classList.remove("hide");
    errorContainer.classList.add("show");
  }
  return createElementAndAppendToParent(errorOptions);
};

let createCard = (data) => {
  return `
  <div class="ui card" id="${data.id}">
  <div class="image">
    <img src=${data.imageUrl}>
  </div>
  <div class="content">
    <p class="header"><b>${data.name}</b> <br> Type: ${data.type}</p>
    <div class="editIcon">
      <p>Edit</p>
      <i class="edit icon" id="editIcon" style="visibility: visible;"></i>
    </div>
    <div class="description">
  ${data.description}
    </div>
    <div class="meta">
      <p>Ability: ${data.ability.name}
      <i class="eye icon" id="eyeIcon" style="visibility: visible;"></i></p> 
      <p class="ability-desc-container hide">${data.ability.description}</p>
    </div>
  </div>
  <div class="extra content">
  <div class="row rowCard">
  <div class="col">
    Quality: ${data.quality}
  </div>
  <div class="col">
    Role: ${data.role}
  </div>
</div>
    <div class="row rowCard">
      <div class="col">
        Attack: ${data.attack}
      </div>
      <div class="col">
        Attach Type: ${data.attackType}
      </div>
    </div>
    <div class="row rowCard">
    <div class="col">
    Attach Range Type: ${data.attackRangeType}
    </div>
    <div class="col">Attach Target Type: ${data.attackTargetType}</div>
    </div>

    <div class="row rowCard">
    <div class="col">Faction: ${data.faction}</div>
    <div class="col">Health: ${data.health}</div>
    </div>
    <div class="row rowCard">
    <div class="col">Maximum Target Count: ${data.maxTargetCount}</div>
      <div class="col"></div>
    </div>
    <div class="row rowCard">
    <div class="col">Movement Speed type: ${data.movementSpeedType}</div>
      <div class="col">Movement Type: ${data.movementType}</div>
    </div>
    <div class="row rowCard">
    <div class="col"></div>
      <div class="col"></div>
    </div>
    <div class="row rowCard">
    <div class="col">Spawn Cool Down(in seconds): ${data.spawnCooldownInSeconds}</div>
      <div class="col">Spawn Cost: ${data.spawnCost}</div>
    </div>
  </div>
</div>
  `;
};

export { createElementAndAppendToParent, showError, createCard };
