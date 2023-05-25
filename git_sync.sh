# Переходим в директорию текущего скрипта
cd "$(dirname "$0")"

# Обновляем локальную ветку из удаленного репозитория
git fetch origin

# Получаем текущую ветку
current_branch=$(git rev-parse --abbrev-ref HEAD)

# Обновляем локальную ветку до последней версии из удаленного репозитория
git pull origin $current_branch

# Проверяем, есть ли изменения в локальной ветке
if [[ $(git status --porcelain) ]]; then
  # Добавляем все изменения в индекс
  git add .

  # Создаем коммит с сообщением
  git commit -m "Automatic sync"

  # Отправляем изменения в нужную ветку в удаленный репозиторий
  git push origin $current_branch
fi