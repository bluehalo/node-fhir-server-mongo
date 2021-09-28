import os
import shutil
from os import path, listdir
from pathlib import Path
from shutil import copyfile
from typing import Union, List

from spark_auto_mapper_fhir.generator.fhir_xml_schema_parser import FhirXmlSchemaParser


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
    parent_dir: Path = Path(__file__).parent.joinpath("../")

    # clean out old stuff
    resources_folder = parent_dir.joinpath("resources")
    if os.path.exists(resources_folder):
        shutil.rmtree(resources_folder)
    os.mkdir(resources_folder)
    resources_folder.joinpath("__init__.py").touch()

    complex_types_folder = parent_dir.joinpath("complex_types")
    if os.path.exists(complex_types_folder):
        shutil.rmtree(complex_types_folder)
    os.mkdir(complex_types_folder)
    complex_types_folder.joinpath("__init__.py").touch()

    extensions_folder = parent_dir.joinpath("extensions")

    backbone_elements_folder = parent_dir.joinpath("backbone_elements")
    if os.path.exists(backbone_elements_folder):
        shutil.rmtree(backbone_elements_folder)
    os.mkdir(backbone_elements_folder)
    backbone_elements_folder.joinpath("__init__.py").touch()

    simple_types_folder = parent_dir.joinpath("simple_types")
    if os.path.exists(simple_types_folder):
        shutil.rmtree(simple_types_folder)
    os.mkdir(simple_types_folder)
    simple_types_folder.joinpath("__init__.py").touch()

    value_sets_folder = parent_dir.joinpath("value_sets")
    if os.path.exists(value_sets_folder):
        shutil.rmtree(value_sets_folder)
    os.mkdir(value_sets_folder)
    value_sets_folder.joinpath("__init__.py").touch()

    fhir_entities = FhirXmlSchemaParser.generate_classes()

    # now print the result
    for fhir_entity in fhir_entities:
        # use template to generate new code files
        resource_name: str = fhir_entity.cleaned_name
        entity_file_name = fhir_entity.name_snake_case
        if fhir_entity.is_value_set:  # valueset
            with open(data_dir.joinpath("template.value_set.jinja2"), "r") as file:
                template_contents = file.read()
                from jinja2 import Template

                file_path = value_sets_folder.joinpath(f"{entity_file_name}.py")
                print(f"Writing value_set: {entity_file_name} to {file_path}...")
                template = Template(
                    template_contents, trim_blocks=True, lstrip_blocks=True
                )
                result = template.render(
                    fhir_entity=fhir_entity,
                )

            if not path.exists(file_path):
                with open(file_path, "w") as file2:
                    file2.write(result)
        elif fhir_entity.is_resource:
            with open(data_dir.joinpath("template.resource.jinja2"), "r") as file:
                template_contents = file.read()
                from jinja2 import Template

                file_path = resources_folder.joinpath(f"{entity_file_name}.py")
                print(f"Writing domain resource: {entity_file_name} to {file_path}...")
                template = Template(
                    template_contents, trim_blocks=True, lstrip_blocks=True
                )
                result = template.render(
                    fhir_entity=fhir_entity,
                )

            # print(result)
            if not path.exists(file_path):
                with open(file_path, "w") as file2:
                    file2.write(result)
        elif fhir_entity.type_ == "BackboneElement" or fhir_entity.is_back_bone_element:
            with open(
                data_dir.joinpath("template.backbone_element.jinja2"), "r"
            ) as file:
                template_contents = file.read()
                from jinja2 import Template

                file_path = backbone_elements_folder.joinpath(f"{entity_file_name}.py")
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
        elif fhir_entity.is_extension:  # valueset
            with open(data_dir.joinpath("template.complex_type.jinja2"), "r") as file:
                template_contents = file.read()
                from jinja2 import Template

                file_path = extensions_folder.joinpath(f"{entity_file_name}.py")
                print(f"Writing extension: {entity_file_name} to {file_path}...")
                template = Template(
                    template_contents, trim_blocks=True, lstrip_blocks=True
                )
                result = template.render(
                    fhir_entity=fhir_entity,
                )

            with open(file_path, "w") as file2:
                file2.write(result)
        elif fhir_entity.type_ == "Element":  # valueset
            with open(data_dir.joinpath("template.complex_type.jinja2"), "r") as file:
                template_contents = file.read()
                from jinja2 import Template

                file_path = complex_types_folder.joinpath(f"{entity_file_name}.py")
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
        elif fhir_entity.type_ in ["Quantity"]:  # valueset
            with open(data_dir.joinpath("template.complex_type.jinja2"), "r") as file:
                template_contents = file.read()
                from jinja2 import Template

                file_path = complex_types_folder.joinpath(f"{entity_file_name}.py")
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

    copy_files_from_base_types_folder(
        backbone_elements_folder=backbone_elements_folder,
        complex_types_folder=complex_types_folder,
        resources_folder=resources_folder,
        value_sets_folder=value_sets_folder,
        extensions_folder=extensions_folder,
    )

    return 0


def copy_files_from_base_types_folder(
    *,
    backbone_elements_folder: Path,
    complex_types_folder: Path,
    resources_folder: Path,
    value_sets_folder: Path,
    extensions_folder: Path,
) -> None:
    # copy resource.py
    print(
        f'Copying {resources_folder.joinpath("../base_types/resources")} to {resources_folder}'
    )
    from os.path import isfile, join

    # resources
    resource_files = [
        f
        for f in listdir(resources_folder.joinpath("../base_types/resources"))
        if isfile(join(resources_folder.joinpath("../base_types/resources"), f))
    ]
    for resource_file in resource_files:
        copyfile(
            resources_folder.joinpath("../base_types/resources").joinpath(
                resource_file
            ),
            resources_folder.joinpath(resource_file),
        )
    # value_sets
    # value_set_files = [
    #     f
    #     for f in listdir(value_sets_folder.joinpath("../base_types/value_sets"))
    #     if isfile(join(value_sets_folder.joinpath("../base_types/value_sets"), f))
    # ]
    # for value_set_file in value_set_files:
    #     copyfile(
    #         value_sets_folder.joinpath("../base_types/value_sets").joinpath(
    #             value_set_file
    #         ),
    #         value_sets_folder.joinpath(value_set_file),
    #     )
    my_copytree(
        value_sets_folder.joinpath("../base_types/value_sets"), value_sets_folder
    )
    # complex types
    complex_types_files = [
        f
        for f in listdir(complex_types_folder.joinpath("../base_types/complex_types"))
        if isfile(join(complex_types_folder.joinpath("../base_types/complex_types"), f))
    ]
    for complex_type_file in complex_types_files:
        copyfile(
            complex_types_folder.joinpath("../base_types/complex_types").joinpath(
                complex_type_file
            ),
            complex_types_folder.joinpath(complex_type_file),
        )
    # remove duplicate imports
    resource_files = [
        f for f in listdir(resources_folder) if isfile(join(resources_folder, f))
    ]
    for resource_file in resource_files:
        clean_duplicate_lines(resources_folder.joinpath(resource_file))
    backbone_files = [
        f
        for f in listdir(backbone_elements_folder)
        if isfile(join(backbone_elements_folder, f))
    ]
    for backbone_file in backbone_files:
        clean_duplicate_lines(backbone_elements_folder.joinpath(backbone_file))
    complex_types_files = [
        f
        for f in listdir(complex_types_folder)
        if isfile(join(complex_types_folder, f))
    ]
    for complex_types_file in complex_types_files:
        clean_duplicate_lines(complex_types_folder.joinpath(complex_types_file))
    value_sets_files = [
        f for f in listdir(value_sets_folder) if isfile(join(value_sets_folder, f))
    ]
    for value_sets_file in value_sets_files:
        clean_duplicate_lines(value_sets_folder.joinpath(value_sets_file))

    extension_files = [
        f for f in listdir(extensions_folder) if isfile(join(extensions_folder, f))
    ]
    for extension_file in extension_files:
        clean_duplicate_lines(extensions_folder.joinpath(extension_file))


if __name__ == "__main__":
    exit(main())
