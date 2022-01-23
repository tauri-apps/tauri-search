import { DocumentProperty, PropCharacteristicsApi } from "~/types/apis";

export const propCharacteristics = (
  update: <T extends Partial<DocumentProperty>>(s: T) => void
) => {
  const api = <E extends string = never>(
    prop: Partial<DocumentProperty>
  ): PropCharacteristicsApi<E> => {
    // update state each iteration
    update(prop);

    // provide fluent api
    return {
      displayed: (b?: boolean) =>
        api<E | "displayed">({ flags: [...(prop?.flags || []), "displayed"] }),
      sortable: (b?: boolean) =>
        api<E | "sortable">({ flags: [...(prop?.flags || []), "sortable"] }),
      searchable: (b?: boolean) =>
        api<E | "searchable">({ flags: [...(prop?.flags || []), "searchable"] }),
      distinct: (b?: boolean) =>
        api<E | "distinct">({ flags: [...(prop?.flags || []), "distinct"] }),
      filterable: (b?: boolean) =>
        api<E | "filterable">({ flags: [...(prop?.flags || []), "filterable"] }),
    } as PropCharacteristicsApi<E>;
  };

  return api({ flags: [] });
};
