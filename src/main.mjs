import { vnode } from "./App.mvue";

function isFinalValue(variable) {
  return (
    Array.isArray(variable) &&
    variable.length === 1 &&
    typeof variable[0] === "string"
  );
}

function mount(vnode, container) {
  vnode.el = document.createElement(vnode.tag)

  for (const key in vnode.props) {
    vnode.el.setAttribute(key, vnode.props[key]);
  }

  if (isFinalValue(vnode.children)) {
    vnode.el.textContent = vnode.children;
  } else {
    vnode.children.forEach((child) => {
      mount(child, vnode.el);
    });
  }

  container.appendChild(vnode.el);
}



mount(vnode, document.getElementById("app"));