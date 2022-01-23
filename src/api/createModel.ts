import { DocumentProperty, ModelDefnApi, SearchModel, T } from "~/types/apis";
import { Project, OptionalKind, PropertySignatureStructure } from "ts-morph";
import { camelize } from "native-dash";
import { propsApi } from "./model-api/propsApi";
import { Keys, UnionToTuple } from "inferred-types";
import { Type } from "~/enums";
import xxhash from "xxhash-wasm";
import { isNumericLiteral, isStringLiteral } from "~/types/type-guards";

/**
 * **createModel**
 *
 * Creates a Meiliseach Model which maps 1:1 to an "index". This allows you to state
 * the expected document structure, specify which properties are visible.
 *
 * > refer to the `src/models` directory for examples
 */
export const createModel = async <N extends string, D extends ModelDefnApi>(
  name: N,
  defn: D
) => {
  const sortable: string[] = [];
  const displayed: string[] = [];
  const distinct: string[] = [];
  const searchable: string[] = [];
  const filterable: string[] = [];
  const document = Object.keys(defn.document).reduce((acc, key) => {
    const userFn = defn.document[key];
    let state: DocumentProperty = { type: Type.Undefined, flags: [], literals: [] };
    /** callback that allows API to update the property's state */
    const update = propsApi((p: Partial<DocumentProperty>) => {
      state = { ...state, ...p };
    });
    userFn(update);
    if (state.flags.includes("sortable")) {
      sortable.push(key);
    }
    if (state.flags.includes("displayed")) {
      displayed.push(key);
    }
    if (state.flags.includes("sortable")) {
      sortable.push(key);
    }
    if (state.flags.includes("distinct")) {
      distinct.push(key);
    }
    if (state.flags.includes("searchable")) {
      searchable.push(key);
    }
    if (state.flags.includes("filterable")) {
      filterable.push(key);
    }

    return { ...acc, [key]: state };
  }, {} as Record<Keys<typeof defn.document>, DocumentProperty>);

  const p = new Project({ useInMemoryFileSystem: true });
  const interfaceName = camelize(name);
  /** source file for interface */
  const s = p.createSourceFile(`${interfaceName}.ts`);
  const i = s.addInterface({
    name: interfaceName,
    isExported: true,
    properties: Object.keys(document).reduce((acc, key) => {
      const prop = document[key];
      const defn: OptionalKind<PropertySignatureStructure> = {
        name: key,
        type: [Type.StringLiteral, Type.NumericLiteral].includes(prop.type)
          ? isStringLiteral(prop)
            ? prop.literals
                .reduce((acc, l) => {
                  return [...acc, `"${l}"`];
                }, [] as string[])
                .join(" | ")
            : isNumericLiteral(prop)
            ? prop.literals
                .reduce((acc, l) => {
                  return [...acc, `${l}`];
                }, [] as string[])
                .join(" | ")
            : prop.type
          : "undefined",
      };
      return [...acc, defn];
    }, [] as OptionalKind<PropertySignatureStructure>[]),
  });
  const { h32 } = await xxhash();
  const dochash = h32(JSON.stringify(document));
  const idx = {
    stopWords: [],
    sortable,
    displayed,
    distinct,
    searchable,
    filterable,
  };
  const idxhash = h32(JSON.stringify(idx));

  const crud = {
    async update(id: string, doc: T, endpoint?: string) {
      //
    },
    async add(doc: T, endpoint?: string) {
      //
    },
    async remove(id: string, endpoint?: string) {
      //
    },
    async search(find: string) {
      //
    },
  };
  // type Props = UnionToTuple<Keys<D["document"]>>;
  // type Document = {
  //   [K in keyof Props]: any;
  // };

  return {
    name,
    info: {
      hash: `${dochash}-${idxhash}`,
      type: i.getType(),
      interfaceDefn: i.getText(),
      document,
      index: {
        stopWords: [],
        sortable,
        displayed,
        distinct,
        searchable,
        filterable,
      },
    },
    crud,
  } as unknown as SearchModel<N, Record<Keys<D["document"]>, DocumentProperty>>;
};
