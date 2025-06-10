import Map from '../utils/map';

export async function reportMapper(report) {
  console.log(report);
  return {
    ...report,
    location: {
      ...report.location,
      placeName: await Map.getPlaceNameByCoordinate(
        report.lat,
        report.lon,
      ),
    },
  };
}
