import { AppDataSource } from '../db';

export const resolvers = {
  Query: {
    reports: async () => {
      try {
        if (!AppDataSource.isInitialized) {
          await AppDataSource.initialize();
        }

        // 1) Candidates per course
        const perCourseRows = await AppDataSource.query(`
          SELECT c.name AS course, COUNT(*) AS candidates
          FROM application a
          JOIN course c ON a.course_id = c.id
          GROUP BY a.course_id
        `);
        const candidatesPerCourse = perCourseRows.map((r: any) => [r.course, r.candidates.toString()]);

        // 2) Overbooked candidates
        const overbookedCandidates = await AppDataSource.query(`
          SELECT DISTINCT a.candidate_id AS id, a.fullName, a.email
          FROM application a
          JOIN (
            SELECT candidate_id, COUNT(*) cnt
            FROM application
            GROUP BY candidate_id
            HAVING cnt > 3
          ) oc ON a.candidate_id = oc.candidate_id
        `);

        // 3) Unchosen candidates
        const unchosenCandidates = await AppDataSource.query(`
          SELECT DISTINCT candidate_id AS id, fullName, email
          FROM application
          WHERE status IS NULL OR status = 'Not Selected'
        `);

        return { candidatesPerCourse, overbookedCandidates, unchosenCandidates };
      } catch (err: any) {
        console.error(" Error in reports resolver:", err);
        throw new Error("Internal server error: " + err.message);
      }
    }
  }
};
