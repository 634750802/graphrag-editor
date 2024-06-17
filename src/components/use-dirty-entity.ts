import { useRef } from 'react';
import { editEntity, type Entity } from '../api/search';
import { useAction } from '../lib/action';
import type { JsonFieldInstance } from './editor-fields/JsonField';

export function useDirtyEntity (id: any) {
  const nameRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const metaRef = useRef<JsonFieldInstance | null>(null);

  const { loading: saving, reset: resetSave, run: save, data: saveReturns, error: saveError, pending: savePending } = useAction(async () => {
    const current = getCurrent();

    if (!current) {
      throw new Error('bad editor state');
    }

    return await editEntity(id, current);
  });

  const reset = (entity: Entity) => {
    if (nameRef.current) {
      nameRef.current.value = entity.name;
    }
    if (descriptionRef.current) {
      descriptionRef.current.value = entity.description;
    }
    if (metaRef.current) {
      metaRef.current.value = entity.meta;
    }
  };

  const getCurrent = () => {
    const name = nameRef.current?.value;
    const description = descriptionRef.current?.value;
    const meta = metaRef.current?.value;

    if (name == null || description == null || meta == null) {
      return undefined;
    }
    return {
      name,
      description,
      meta,
    };
  };

  return {
    nameRef,
    descriptionRef,
    metaRef,
    reset,
    save,
    saving,
    saveError,
    savePending,
    saveReturns,
    resetSave,
  };
}