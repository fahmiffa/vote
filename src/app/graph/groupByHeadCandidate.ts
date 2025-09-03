interface DataItem {
  headName: string;
  candidateName: string;
}

export function groupByHeadAndCandidate(data: DataItem[]) {
  const result: Record<string, Record<string, number>> = {};

  data.forEach(({ headName, candidateName }) => {
    if (!result[headName]) {
      result[headName] = {};
    }
    if (!result[headName][candidateName]) {
      result[headName][candidateName] = 0;
    }
    result[headName][candidateName]++;
  });

  return result;
}
