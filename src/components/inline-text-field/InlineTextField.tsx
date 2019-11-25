import React, { ChangeEvent, Component, createRef, Ref, RefObject } from "react";
import { TextField } from "@material-ui/core";
import { FontWeightProperty } from "csstype";

import { Sizes, Container } from "./InlineTextField.styles";

export interface InlineTextFieldProps {
  readonly name: string;
  readonly value: string;
  readonly size?: Sizes;
  readonly fontWeight?: FontWeightProperty;

  readonly ref?: Ref<InlineTextField>;

  readonly onChange: (newValue: string) => void;
}

class InlineTextField extends Component<InlineTextFieldProps> {
  private _containerRef: RefObject<HTMLDivElement>;

  constructor(props: InlineTextFieldProps) {
    super(props);

    this._containerRef = createRef();
  }

  focus() {
    const input = this._containerRef.current!.querySelector("input");
    if (input) {
      input.focus();
      input.select();
    }
  }

  render() {
    const {
      value,
      name,
      onChange,
      size = "regular",
      fontWeight = "normal"
    } = this.props;

    const containerRef = this._containerRef;

    const handleInputInput = (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      onChange(value)
    };

    return (
      <Container
        size={size}
        fontWeight={fontWeight}
        ref={containerRef}>
        <TextField
          name={name}
          value={value}
          onChange={() => {}}
          onInput={handleInputInput}
        />
        <span>
          {value || " "}
        </span>
      </Container>
    );
  }
};

export { InlineTextField };