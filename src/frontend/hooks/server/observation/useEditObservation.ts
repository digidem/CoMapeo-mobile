import {Observation} from '@mapeo/schema';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {api} from '../../../api';

type EditObservationProps = Partial<Observation> & {
  versionId: Observation['versionId'];
};

export const useEditObservation = (observationId?: string) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (observation: EditObservationProps) => {
      return await api.observation.update(observation.versionId, observation);
    },
    onSuccess: () => {
      queryClient.invalidateQueries([
        'observation',
        observationId,
        'observations',
      ]);
    },
  });

  return mutation;
};