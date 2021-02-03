const { generateQuery, asyncQuery } = require('../helpers/queryHelp')

const db = require('../database')

module.exports = {
    All: (req, res) => {
        // define query sql
        const queryMovies = `select m.name, m.release_date, m.release_month, m.release_year, m.duration_min, m.genre, m.description, a.status, l.location, z.time  from movies m
        JOIN movies ms
        on m.id = ms.id 
        join schedules s
        on s.id = ms.id
        left join locations l
        on l.id = s.location_id
        left join show_times z
        on z.id = s.time_id
        left join movie_status a
        on a.id = m.status 
        ;`

        db.query(queryMovies, (err, result) => {
            // check error
            if (err) return res.status(500).send(err)

            // if success
            res.status(200).send(result)
        })
    },
    Separate: (req, res) => {
        // define query sql
        const {location, status, time} = req.query

        const queryMovies = `select m.name, m.release_date, m.release_month, m.release_year, m.duration_min, m.genre, m.description, a.status, l.location, z.time  from movies m
        JOIN movies ms
        on m.id = ms.id 
        join schedules s
        on s.id = ms.id
        left join locations l
        on l.id = s.location_id
        left join show_times z
        on z.id = s.time_id
        left join movie_status a
        on a.id = m.status 
        where l.location = ${db.escape(location)}
        or a.status = ${db.escape(status)}
        or z.time = ${db.escape(time)}
        ;`


        db.query(queryMovies, (err, result) => {
            // check error
            if (err) return res.status(500).send(err)

            // if success
            res.status(200).send(result)
        })
    },
    AddMovies: async (req, res) => {
        const { name, genre, release_date, release_month, release_year, duration_min, description } = req.body
        try {
            const addQuery = `insert into movies (name, genre, release_date, release_month, release_year, duration_min, description) 
                              values (${db.escape(name)}, ${db.escape(genre)}, ${db.escape(release_date)}, ${db.escape(release_month)}, ${db.escape(release_year)}, ${db.escape(duration_min)}, ${db.escape(description)})`

            const result = await asyncQuery(addQuery)

            const getQuery = `select * from movies m
            LEFT JOIN schedules c
            on m.id = c.id;`

            const resultUpdate = await asyncQuery(getQuery)

            res.status(200).send(resultUpdate)
        }
        catch (err) {
            console.log(err)
            res.status(400).send(err)
        }
    }
}