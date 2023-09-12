const copyButtonCLINIT = document.getElementById("cl-init-button");
const copyButtonINIT = document.getElementById("init-button");
const copyButtonSHARED = document.getElementById("shared-button");

const inputFieldModel = document.getElementById("model-input");
const inputFieldName = document.getElementById("name-input");
const inputFieldCategory = document.getElementById("category-input");
const checkBox = document.getElementById("switch-physics");

const copiedText = document.getElementById("copy-text");

const copySound = document.getElementById("copysound");

console.log("script.js loaded");
let isAnimating = false;
let timeoutID = null;

copiedText.style.color = "rgba(56, 64, 79, 0)"; // Use "rgba" for the color with alpha transparency

copySound.volume = 0.2;




function grabClInit(){
    const clInit = `
    include("shared.lua")
    
    function ENT:Draw() self:DrawModel() end
    `;
    console.log(clInit);
    return clInit;
}

function grabInit(){
    var modelName = inputFieldModel.value;
    const Init = `
    AddCSLuaFile("shared.lua")
    AddCSLuaFile("cl_init.lua")
    include("shared.lua")

    function ENT:Initialize()
        self:SetModel("INSERTMODELNAME")
        self:PhysicsInit(SOLID_VPHYSICS)
        self:SetMoveType(MOVETYPE_VPHYSICS)
        self:SetSolid(SOLID_VPHYSICS)

        local phys = self:GetPhysicsObject()

        if phys:IsValid() then phys:Wake() end
    end
    `;
    var final = Init.replace("INSERTMODELNAME",modelName);
    console.log(checkBox.checked)
    if(checkBox.checked){
        console.log(final);
        return final;
    } else if (!checkBox.checked) {
        var pt1 = final.replace("MOVETYPE_VPHYSICS","MOVETYPE_NONE");
        var actualFinal = pt1.replace("if phys:IsValid() then phys:Wake() end", " ")
        console.log(actualFinal);
        return actualFinal;
    }

}


function grabShared(){
    const shared = `
    ENT.Type = "anim"
    ENT.Base = "base_anim"

    ENT.PrintName = "INSERTNAMEHERE"
    
    ENT.Spawnable = true
    ENT.Category = "INSERTCATEGORYHERE"
    `;
    var pt1 = shared.replace("INSERTNAMEHERE", inputFieldName.value);
    var final = pt1.replace("INSERTCATEGORYHERE", inputFieldCategory.value);
    console.log(final);
    return final;
}



function clickAnim() {
  const clickedButton = this; // 'this' refers to the button that triggered the event
  const buttonId = this.id;
  if(buttonId == "cl-init-button") { navigator.clipboard.writeText(grabClInit());
} else if(buttonId == "init-button") { navigator.clipboard.writeText(grabInit()); 
} else if(buttonId == "shared-button") { navigator.clipboard.writeText(grabShared()); }
  copySound.load();
  copySound.play();

  if (timeoutID !== null) {
    // If a timeout is already running, clear it
    clearTimeout(timeoutID);
    timeoutID = null;
  }

  if (!isAnimating) {
    clickedButton.classList.remove("bounce-click");
    clickedButton.classList.add("bounce-click");
    isAnimating = true;
  }
  copiedText.style.color = "rgba(56, 64, 79, 1)";

  // Set a new timeout and store its ID
  timeoutID = setTimeout(function () {
    copiedText.style.color = "rgba(56, 64, 79, 0)";
    timeoutID = null; // Clear the stored timeout ID when it's done
  }, 800);

  if (isAnimating) {
    setTimeout(function () {
      if (isAnimating) {
        clickedButton.classList.remove("bounce-click");
        isAnimating = false;
      }
    }, 200);
  }
}
copyButtonCLINIT.addEventListener("click", clickAnim);
copyButtonINIT.addEventListener("click", clickAnim);
copyButtonSHARED.addEventListener("click", clickAnim);
