import {
  generateLoaderAbsoluteTemplate,
  generateStoryItemTemplate,
  generateStoriesListEmptyTemplate,
  generateStoriesListErrorTemplate,
  generateSaveStoryButtonTemplate,
  generateRemoveStoryButtonTemplate,
} from '../../templates';
import BookmarkPresenter from './bookmark-presenter';
import Database from '../../data/database';
import Map from '../../utils/map';
import * as StoryAppAPI from '../../data/api';

export default class BookmarkPage {
  #presenter = null;
  #map = null;

  async render() {
    return `
      <section>
        <div class="stories-list__map__container">
          <div id="map" class="stories-list__map"></div>
          <div id="map-loading-container"></div>
        </div>
      </section>
 
      <section class="container">
        <h1 class="section-title">Daftar Cerita Tersimpan</h1>
 
        <div class="stories-list__container">
          <div id="stories-list"></div>
          <div id="stories-list-loading-container"></div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new BookmarkPresenter({
      view: this,
      apiModel: StoryAppAPI,
      dbModel: Database,
    });
    await this.#presenter.initialGalleryAndMap();
  }

  populateBookmarkedReports(message, reports) {
    if (reports.length <= 0) {
      this.populateBookmarkedReportsListEmpty();
      return;
    }

    const html = reports.reduce((accumulator, report) => {
      console.log(report);
      const hasValidCoordinates =
        report && report.lat != null && report.lon != null;

      if (hasValidCoordinates && this.#map) {
        const coordinate = [report.lat, report.lon];
        const markerOptions = { alt: report.name };
        const popupOptions = { content: report.name };
        this.#map.addMarker(coordinate, markerOptions, popupOptions);
      }

      const storyHtml = `
        <div class="story-item">
          ${generateStoryItemTemplate({
        ...report,
        reporterName: report.name,
      })}
          <div class="story-actions" id="save-actions-container-${report.id}"></div>
        </div>
      `;

      return accumulator + storyHtml;
    }, '');

    document.getElementById('stories-list').innerHTML = `
      <div class="stories-list">${html}</div>
    `;

    reports.forEach((report) => {
      this.#presenter.showSaveButton(`#save-actions-container-${report.id}`, report.id);
    });
  }

  async initialMap() {
    this.#map = await Map.build('#map', {
      zoom: 10,
      locate: true,
    });
  }
  showMapLoading() {
    document.getElementById('map-loading-container').innerHTML = generateLoaderAbsoluteTemplate();
  }
  hideMapLoading() {
    document.getElementById('map-loading-container').innerHTML = '';
  }

  populateBookmarkedReportsListEmpty() {
    document.getElementById('stories-list').innerHTML = generateStoriesListEmptyTemplate();
  }

  populateBookmarkedReportsError(message) {
    document.getElementById('stories-list').innerHTML = generateStoriesListErrorTemplate(message);
  }

  showReportsListLoading() {
    document.getElementById('stories-list-loading-container').innerHTML =
      generateLoaderAbsoluteTemplate();
  }

  hideReportsListLoading() {
    document.getElementById('stories-list-loading-container').innerHTML = '';
  }


  renderSaveButton(containerId, storyId) {
    const container = document.querySelector(containerId);
    if (!container) return;

    container.innerHTML = generateSaveStoryButtonTemplate();

    container.querySelector('#story-detail-save').addEventListener('click', async () => {
      await this.#presenter.saveStory(storyId);
      await this.#presenter.showSaveButton(containerId, storyId);
    });
  }

  renderRemoveButton(containerId, storyId) {
    const container = document.querySelector(containerId);
    if (!container) return;

    container.innerHTML = generateRemoveStoryButtonTemplate();

    container.querySelector('#story-detail-remove').addEventListener('click', async () => {
      await this.#presenter.removeStory(storyId);
      await this.#presenter.showSaveButton(containerId, storyId);
    });
  }

  saveToBookmarkSuccessfully(message) {
    alert(message);
    console.log(message);
  }

  saveToBookmarkFailed(message) {
    alert(message);
    console.log(message);
  }
}