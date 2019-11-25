import React from "react";
import { InlineTextField } from "../../components/inline-text-field/InlineTextField";

export interface ProjectTitleProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
}

const ProjectTitle = ({ value, onChange }: ProjectTitleProps) => (
  <InlineTextField
    name="projectName"
    value={value}
    onChange={onChange}
    size="large"
  />
);

export { ProjectTitle };