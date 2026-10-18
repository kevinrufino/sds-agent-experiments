    "no-restricted-syntax": [
      "error",
      {
        selector: "JSXElement[openingElement.name.name=/^(Button|IconButton)$/]:has(JSXIdentifier[name=/^IconTrash/])",
        message: "Destructive actions (remove/delete) must use ButtonDanger or DestructiveIconButton from \"primitives\", not Button/IconButton.",
      },
      {
        selector: "JSXElement[openingElement.name.name=/^(Button|IconButton)$/]:has(JSXText[value=/(remove|delete)/i])",
        message: "Destructive actions (remove/delete) must use ButtonDanger or DestructiveIconButton from \"primitives\", not Button/IconButton.",
      },
      {
        selector: "JSXOpeningElement[name.name=/^(Button|IconButton)$/] > JSXAttribute[name.name='aria-label'] :matches(Literal[value=/(remove|delete)/i], TemplateElement[value.raw=/(remove|delete)/i])",
        message: "Destructive actions (remove/delete) must use ButtonDanger or DestructiveIconButton from \"primitives\", not Button/IconButton.",
      },
    ],
