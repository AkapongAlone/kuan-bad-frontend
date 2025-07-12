export const hasTeamsPlayedBefore = (
    team1: [string, string],
    team2: [string, string],
    matchHistory: [string, string][]
  ): boolean => {
    const [p1, p2] = team1;
    const [p3, p4] = team2;
    
    return matchHistory.some(history => {
      const [histTeam1Str, histTeam2Str] = history;
      const histTeam1 = histTeam1Str.split(',');
      const histTeam2 = histTeam2Str.split(',');
      
      return (
        (histTeam1.includes(p1) && histTeam1.includes(p2) && 
         histTeam2.includes(p3) && histTeam2.includes(p4)) ||
        (histTeam1.includes(p3) && histTeam1.includes(p4) && 
         histTeam2.includes(p1) && histTeam2.includes(p2))
      );
    });
  };
  
  export const getMatchDuration = (startTime: Date): number => {
    return Math.floor((new Date().getTime() - new Date(startTime).getTime()) / 60000);
  };
  
  export const getActiveCourtCount = (matches: any[]): number => {
    return matches.filter(m => !m.endTime).length;
  };