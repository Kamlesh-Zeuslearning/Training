let activeBox = null;
let offsetX = 0;
let offsetY = 0;

class Parent {
    constructor() {
        this.div = document.createElement("div");
        this.div.classList.add("parent");
        this.div.style.position = "relative";
        document.getElementById("wrapper").appendChild(this.div);
    }
    appendBox(box) {
        this.div.appendChild(box.div);
    }
}

class Box {
    constructor(parent) {
        this.div = document.createElement("div");
        this.div.classList.add("box");

        this.div.setAttribute(
            "data-box-id",
            `box-${Math.random().toString(36).substr(2, 9)}`
        );

        parent.appendBox(this);
        this.initDragEvents();

        this.offsetX = 0;
        this.offsetY = 0;
    }

    initDragEvents(){
        this.div.addEventListener("pointerdown", (e) => {
            const rect = this.div.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
            activeBox = this.div;
        });
    }

}


document.addEventListener("pointermove", (e) => {
    if (!activeBox) return;

    const parent = activeBox.parentElement;
    const parentRect = parent.getBoundingClientRect();
    const boxWidth = activeBox.offsetWidth;
    const boxHeight = activeBox.offsetHeight;

    let left = e.clientX - parentRect.left - offsetX;
    let top = e.clientY - parentRect.top - offsetY;

    // Clamp values
    left = Math.max(0, Math.min(left, parentRect.width - boxWidth));
    top = Math.max(0, Math.min(top, parentRect.height - boxHeight));

    activeBox.style.left = `${left}px`;
    activeBox.style.top = `${top}px`;
});

document.addEventListener("pointerup", () => {
    activeBox = null;
});

const parent1 = new Parent();
const parent2 = new Parent();
const parent3 = new Parent();
const parent4 = new Parent();

new Box(parent1);
new Box(parent2);
new Box(parent3);
new Box(parent4);

new Box(parent1);
new Box(parent2);
new Box(parent3);
new Box(parent4);

window.onresize = () => {
    document.querySelectorAll(".parent").forEach((parent) => {
        parent.querySelectorAll(".box").forEach((box) => {
            const parentRect = parent.getBoundingClientRect();
            const boxRect = box.getBoundingClientRect();

            if (boxRect.left + boxRect.width > parentRect.width) {
                box.style.left = `${parentRect.width - boxRect.width}px`;
            }
            if (boxRect.top + boxRect.height > parentRect.height) {
                box.style.top = `${parentRect.height - boxRect.height}px`;
            }
        });
    });
};
