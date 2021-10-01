import os
import shutil
from os import path, listdir
from pathlib import Path
from shutil import copyfile
from typing import Union, List

from fhir_xml_schema_parser import FhirXmlSchemaParser


def my_copytree(
    src: Union[Path, str],
    dst: Union[Path, str],
    symlinks: bool = False,
    # ignore: Union[
    #     None,
    #     Callable[[str, List[str]], Iterable[str]],
    #     Callable[[Union[str, os.PathLike[str]], List[str]], Iterable[str]],
    # ] = None,
) -> None:
    for item in os.listdir(src):
        s = os.path.join(src, item)
        d = os.path.join(dst, item)
        if os.path.isdir(s):
            shutil.copytree(s, d, symlinks)
        else:
            shutil.copy2(s, d)


def clean_duplicate_lines(file_path: Union[Path, str]) -> None:
    print(f"Removing duplicate lines from {file_path}")
    with open(file_path, "r") as file:
        lines: List[str] = file.readlines()
    new_lines: List[str] = []
    for line in lines:
        if not line.strip() or not line.lstrip().startswith("from"):
            new_lines.append(line)
        elif line not in new_lines and line.lstrip() not in [
            c.lstrip() for c in new_lines
        ]:
            new_lines.append(line)
    with open(file_path, "w") as file:
        file.writelines(new_lines)


def main() -> int:
    data_dir: Path = Path(__file__).parent.joinpath("./")
    parent_schema_dir = Path(__file__).parent.joinpath("../")
    graphql_schema_dir: Path = parent_schema_dir.joinpath("schemas")
    graphql_resolvers_dir: Path = parent_schema_dir.joinpath("resolvers")

    # clean out old stuff
    resources_folder = graphql_schema_dir.joinpath("resources")
    if os.path.exists(resources_folder):
        shutil.rmtree(resources_folder)
    os.mkdir(resources_folder)

    resource_resolvers_folder = graphql_resolvers_dir.joinpath("resources")
    if os.path.exists(resource_resolvers_folder):
        shutil.rmtree(resource_resolvers_folder)
    os.mkdir(resource_resolvers_folder)

    complex_types_folder = graphql_schema_dir.joinpath("complex_types")
    if os.path.exists(complex_types_folder):
        shutil.rmtree(complex_types_folder)
    os.mkdir(complex_types_folder)

    complex_resolvers_types_folder = graphql_resolvers_dir.joinpath("complex_types")
    if os.path.exists(complex_resolvers_types_folder):
        shutil.rmtree(complex_resolvers_types_folder)
    os.mkdir(complex_resolvers_types_folder)

    extensions_folder = graphql_schema_dir.joinpath("extensions")
    if os.path.exists(extensions_folder):
        shutil.rmtree(extensions_folder)
    os.mkdir(extensions_folder)

    extensions_resolvers_folder = graphql_resolvers_dir.joinpath("extensions")
    if os.path.exists(extensions_resolvers_folder):
        shutil.rmtree(extensions_resolvers_folder)
    os.mkdir(extensions_resolvers_folder)

    backbone_elements_folder = graphql_schema_dir.joinpath("backbone_elements")
    if os.path.exists(backbone_elements_folder):
        shutil.rmtree(backbone_elements_folder)
    os.mkdir(backbone_elements_folder)

    backbone_elements_resolvers_folder = graphql_resolvers_dir.joinpath("backbone_elements")
    if os.path.exists(backbone_elements_resolvers_folder):
        shutil.rmtree(backbone_elements_resolvers_folder)
    os.mkdir(backbone_elements_resolvers_folder)

    value_sets_folder = graphql_schema_dir.joinpath("value_sets")
    if os.path.exists(value_sets_folder):
        shutil.rmtree(value_sets_folder)
    os.mkdir(value_sets_folder)

    fhir_entities = FhirXmlSchemaParser.generate_classes()

    # generate schema.graphql
    with open(data_dir.joinpath("template.query.jinja2"), "r") as file:
        template_contents = file.read()
        from jinja2 import Template

        file_path = graphql_schema_dir.joinpath(f"schema.graphql")
        template = Template(
            template_contents, trim_blocks=True, lstrip_blocks=True
        )
        result = template.render(
            fhir_entities=[f for f in fhir_entities if f.is_resource],
        )
        with open(file_path, "w") as file2:
            file2.write(result)

    # now print the result
    for fhir_entity in fhir_entities:
        # use template to generate new code files
        resource_name: str = fhir_entity.cleaned_name
        entity_file_name = fhir_entity.name_snake_case
        if fhir_entity.is_value_set:  # valueset
            pass
            # with open(data_dir.joinpath("template.value_set.jinja2"), "r") as file:
            #     template_contents = file.read()
            #     from jinja2 import Template
            #
            #     file_path = value_sets_folder.joinpath(f"{entity_file_name}.graphql")
            #     print(f"Writing value_set: {entity_file_name} to {file_path}...")
            #     template = Template(
            #         template_contents, trim_blocks=True, lstrip_blocks=True
            #     )
            #     result = template.render(
            #         fhir_entity=fhir_entity,
            #     )
            #
            # if not path.exists(file_path):
            #     with open(file_path, "w") as file2:
            #         file2.write(result)
        elif fhir_entity.is_resource:
            with open(data_dir.joinpath("template.resource.jinja2"), "r") as file:
                template_contents = file.read()
                from jinja2 import Template

                file_path = resources_folder.joinpath(f"{entity_file_name}.graphql")
                print(f"Writing domain resource: {entity_file_name} to {file_path}...")
                template = Template(
                    template_contents, trim_blocks=True, lstrip_blocks=True
                )
                result = template.render(
                    fhir_entity=fhir_entity,
                )
            if not path.exists(file_path):
                with open(file_path, "w") as file2:
                    file2.write(result)
            # write resolvers
            with open(data_dir.joinpath("resolvers").joinpath("template.resource.jinja2"), "r") as file:
                template_contents = file.read()
                from jinja2 import Template

                file_path = resource_resolvers_folder.joinpath(f"{entity_file_name}.js")
                print(f"Writing domain resource resolver: {entity_file_name} to {file_path}...")
                template = Template(
                    template_contents, trim_blocks=True, lstrip_blocks=True
                )
                result = template.render(
                    fhir_entity=fhir_entity,
                )
            if not path.exists(file_path):
                with open(file_path, "w") as file2:
                    file2.write(result)
        elif fhir_entity.type_ == "BackboneElement" or fhir_entity.is_back_bone_element:
            with open(
                data_dir.joinpath("template.backbone_element.jinja2"), "r"
            ) as file:
                template_contents = file.read()
                from jinja2 import Template

                file_path = backbone_elements_folder.joinpath(f"{entity_file_name}.graphql")
                print(
                    f"Writing backbone_elements_folder: {entity_file_name} to {file_path}..."
                )
                template = Template(
                    template_contents, trim_blocks=True, lstrip_blocks=True
                )
                result = template.render(
                    fhir_entity=fhir_entity,
                )

            if not path.exists(file_path):
                with open(file_path, "w") as file2:
                    file2.write(result)
            # write resolvers
            with open(data_dir.joinpath("resolvers").joinpath("template.backbone_element.jinja2"), "r") as file:
                template_contents = file.read()
                from jinja2 import Template

                file_path = backbone_elements_resolvers_folder.joinpath(f"{entity_file_name}.js")
                print(f"Writing domain resource resolver: {entity_file_name} to {file_path}...")
                template = Template(
                    template_contents, trim_blocks=True, lstrip_blocks=True
                )
                result = template.render(
                    fhir_entity=fhir_entity,
                )
            if not path.exists(file_path):
                with open(file_path, "w") as file2:
                    file2.write(result)

        elif fhir_entity.is_extension:  # valueset
            with open(data_dir.joinpath("template.complex_type.jinja2"), "r") as file:
                template_contents = file.read()
                from jinja2 import Template

                file_path = extensions_folder.joinpath(f"{entity_file_name}.graphql")
                print(f"Writing extension: {entity_file_name} to {file_path}...")
                template = Template(
                    template_contents, trim_blocks=True, lstrip_blocks=True
                )
                result = template.render(
                    fhir_entity=fhir_entity,
                )

            with open(file_path, "w") as file2:
                file2.write(result)
            # write resolvers
            with open(data_dir.joinpath("resolvers").joinpath("template.complex_type.jinja2"), "r") as file:
                template_contents = file.read()
                from jinja2 import Template

                file_path = extensions_resolvers_folder.joinpath(f"{entity_file_name}.js")
                print(f"Writing extension resolver: {entity_file_name} to {file_path}...")
                template = Template(
                    template_contents, trim_blocks=True, lstrip_blocks=True
                )
                result = template.render(
                    fhir_entity=fhir_entity,
                )
            if not path.exists(file_path):
                with open(file_path, "w") as file2:
                    file2.write(result)

        elif fhir_entity.type_ == "Element":  # valueset
            with open(data_dir.joinpath("template.complex_type.jinja2"), "r") as file:
                template_contents = file.read()
                from jinja2 import Template

                file_path = complex_types_folder.joinpath(f"{entity_file_name}.graphql")
                print(f"Writing complex_type: {entity_file_name} to {file_path}...")
                template = Template(
                    template_contents, trim_blocks=True, lstrip_blocks=True
                )
                result = template.render(
                    fhir_entity=fhir_entity,
                )

            if not path.exists(file_path):
                with open(file_path, "w") as file2:
                    file2.write(result)
            # write resolvers
            with open(data_dir.joinpath("resolvers").joinpath("template.complex_type.jinja2"), "r") as file:
                template_contents = file.read()
                from jinja2 import Template

                file_path = complex_resolvers_types_folder.joinpath(f"{entity_file_name}.js")
                print(f"Writing domain resource resolver: {entity_file_name} to {file_path}...")
                template = Template(
                    template_contents, trim_blocks=True, lstrip_blocks=True
                )
                result = template.render(
                    fhir_entity=fhir_entity,
                )
            if not path.exists(file_path):
                with open(file_path, "w") as file2:
                    file2.write(result)

        elif fhir_entity.type_ in ["Quantity"]:  # valueset
            with open(data_dir.joinpath("template.complex_type.jinja2"), "r") as file:
                template_contents = file.read()
                from jinja2 import Template

                file_path = complex_types_folder.joinpath(f"{entity_file_name}.graphql")
                print(f"Writing complex_type: {entity_file_name} to {file_path}...")
                template = Template(
                    template_contents, trim_blocks=True, lstrip_blocks=True
                )
                result = template.render(
                    fhir_entity=fhir_entity,
                )

            if not path.exists(file_path):
                with open(file_path, "w") as file2:
                    file2.write(result)
        else:
            # assert False, f"{resource_name}: {fhir_entity.type_} is not supported"
            print(f"{resource_name}: {fhir_entity.type_} is not supported")
        # print(result)

    return 0


if __name__ == "__main__":
    exit(main())
