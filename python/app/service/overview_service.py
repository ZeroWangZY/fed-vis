from datetime import datetime, timedelta

from app.dao.order import query_count


def get_overview(cached=False, type='start'):
    if cached:
        return {
            4: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 1, 510
            ],
            5: [
                68854, 55082, 54017, 485, 61821, 67203, 41883, 54834, 449,
                51401, 478, 64462, 75029, 76803, 55299, 435, 51842, 466, 77276,
                107145, 70595, 61210, 55465, 56240, 71249, 62831, 73426, 71703,
                57973, 94, 394
            ],
            6: [
                64408, 664, 73394, 62816, 62837, 60305, 59242, 58534, 74333,
                7598, 68848, 39078, 507, 65268, 65463, 76967, 801, 73650,
                60885, 498, 62737, 64465, 78683, 80401, 72859, 65279, 138, 503,
                70539, 87293
            ],
            7: [
                84017, 72598, 65762, 69274, 75738, 70332, 124, 577, 75536,
                76593, 70677, 74298, 121, 599, 76917, 66683, 73028, 82403,
                72811, 72643, 66063, 83123, 616, 67397, 64272, 67406, 112, 9,
                543, 68628, 634
            ],
            8: [
                75095, 71499, 80352, 82791, 83279, 77503, 117, 5, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
            ]
        }
    date = datetime(2017, 5, 1)
    res = {5: [], 6: [], 7: [], 8: [], 9: [], 10: []}
    while not (date.month == 11 and date.day == 1):
        count = 0
        if type == 'all':
            count += query_count(date, date + timedelta(days=1), type_='start')
            count += query_count(date, date + timedelta(days=1), type_='des')
        else:
            count = query_count(date, date + timedelta(days=1), type_=type)
        print(date.month, '.', date.day, ' ', count)
        res[date.month].append(count)
        date += timedelta(days=1)
    return res


if __name__ == "__main__":
    print(get_overview(False))
