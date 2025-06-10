export default class HomePresenter {
  #view;
  #apiModel;
  #dbModel;

  constructor({ view, apiModel, dbModel }) {
    this.#view = view;
    this.#apiModel = apiModel;
    this.#dbModel = dbModel;
  }

  async initialGalleryAndMap() {
    this.#view.showLoading();
    try {
      await this.showReportsListMap();
      const response = await this.#apiModel.getAllStories();

      if (!response.ok) {
        this.#view.populateReportsListError(response.message);
        return;
      }

      this.#view.populateReportsList(response.message, response.listStory);
    } catch (error) {
      this.#view.populateReportsListError(error.message);
    } finally {
      this.#view.hideLoading();
    }
  }

  async showReportsListMap() {
    this.#view.showMapLoading();
    try {
      await this.#view.initialMap();
    } catch (error) {
      console.error('showReportsListMap: error:', error);
    } finally {
      this.#view.hideMapLoading();
    }
  }

  async showSaveButton(containerId, storyId) {
    const isSaved = await this.#isStorySaved(storyId);

    if (isSaved) {
      this.#view.renderRemoveButton(containerId, storyId);
    } else {
      this.#view.renderSaveButton(containerId, storyId);
    }
  }

  async #isStorySaved(storyId) {
    const story = await this.#dbModel.getStoryById(storyId);
    return !!story;
  }

  async saveStory(storyId) {
    try {
      const response = await this.#apiModel.getStoryById(storyId);

      if (!response) {
        this.#view.saveToBookmarkFailed('Gagal menyimpan cerita.');
        return;
      }

      await this.#dbModel.putStory(response.story);
      this.#view.saveToBookmarkSuccessfully('Cerita disimpan.');
    } catch (error) {
      this.#view.saveToBookmarkFailed(error.message);
    }
  }

  async removeStory(storyId) {
    try {
      await this.#dbModel.removeStory(storyId);
      this.#view.saveToBookmarkSuccessfully('Cerita dibuang.');
    } catch (error) {
      this.#view.saveToBookmarkFailed(error.message);
    }
  }
}