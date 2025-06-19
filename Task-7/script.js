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

        let randomLeft = Math.floor(Math.random() * parent.div.offsetWidth) + 1;
        let randomTop = Math.floor(Math.random() * parent.div.offsetHeight) + 1;

        this.div.style.left =
            randomLeft + 50 > parent.div.offsetWidth
                ? `${randomLeft - 50}px`
                : `${randomLeft}px`;
        this.div.style.top =
            randomTop + 50 > parent.div.offsetHeight
                ? `${randomTop - 50}px`
                : `${randomTop}px`;
    }
}

document.addEventListener("pointerdown", (e) => {
    if (e.target.classList.contains("box")) {
        activeBox = e.target;
        const rect = activeBox.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;

        activeBox.setPointerCapture(e.pointerId);
    }
});

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

document.addEventListener("pointerup", (e) => {
    activeBox.releasePointerCapture(e.pointerId); // 🔑 Release
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
