import { Sorter } from "../../utils/sorter";

export default [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    sorter: {
      compare: (a, b) =>
        Sorter.DEFAULT(a.name, b.name),
    },
  },
  {
    title: 'Course',
    dataIndex: 'course',
    key: 'course',
    sorter: {
      compare: (a, b) =>
        Sorter.DEFAULT(a.name, b.name),
    },
  },
  {
    title: 'Start Date',
    dataIndex: 'start_date',
    key: 'start_date',
    sorter: (a, b) => Sorter.DATE(a.start_date, b.start_date),
  },
];