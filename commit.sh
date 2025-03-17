#!/bin/bash

# 优雅的Git提交脚本 - Elegant Git Commit Script
# 按照规范化提交格式构建提交信息
# Builds commit messages in a standardized format

# ANSI color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 显示标题
echo -e "${BLUE}==================================================${NC}"
echo -e "${BLUE}           优雅的 Git 提交助手                     ${NC}"
echo -e "${BLUE}==================================================${NC}"
echo ""

# 检查是否为Git仓库
if [ ! -d .git ]; then
  echo -e "${RED}错误: 当前目录不是Git仓库${NC}"
  exit 1
fi

# 显示当前状态
echo -e "${YELLOW}当前Git状态:${NC}"
git status -s

# 提示用户是否要继续
echo ""
read -p $'\033[0;33m是否继续提交? (y/n):\033[0m ' confirm
if [[ $confirm != [yY] ]]; then
  echo -e "${RED}提交已取消${NC}"
  exit 0
fi

# 选择是暂存所有文件还是选择性暂存
echo ""
read -p $'\033[0;33m是否暂存所有变更? (y/n):\033[0m ' stage_all
if [[ $stage_all != [yY] ]]; then
  # 选择性暂存文件
  echo -e "${CYAN}请选择要暂存的文件:${NC}"
  
  # 获取所有变更的文件
  readarray -t changed_files < <(git status -s | awk '{print $2}')
  
  for i in "${!changed_files[@]}"; do
    file="${changed_files[$i]}"
    echo -e "[$i] ${file}"
  done
  
  echo ""
  read -p $'\033[0;36m请输入文件编号（用空格分隔多个编号）:\033[0m ' -a selections
  
  # 暂存选中的文件
  for selection in "${selections[@]}"; do
    if [[ $selection =~ ^[0-9]+$ ]] && [ "$selection" -lt "${#changed_files[@]}" ]; then
      git add "${changed_files[$selection]}"
      echo -e "${GREEN}已暂存: ${changed_files[$selection]}${NC}"
    fi
  done
else
  # 暂存所有文件
  git add -A
  echo -e "${GREEN}已暂存所有变更${NC}"
fi

# 显示暂存区状态
echo ""
echo -e "${YELLOW}暂存区状态:${NC}"
git status -s

# 提交类型选择
echo ""
echo -e "${CYAN}请选择提交类型:${NC}"
commit_types=(
  "feat: 新功能"
  "fix: 修复bug"
  "docs: 文档变更"
  "style: 代码格式修改(不影响代码运行的变动)"
  "refactor: 重构(既不是增加feature，也不是修复bug)"
  "perf: 性能优化"
  "test: 增加测试"
  "chore: 构建过程或辅助工具的变动"
  "ci: CI相关变更"
  "revert: 回退之前的提交"
  "build: 构建系统或外部依赖项更改"
)

for i in "${!commit_types[@]}"; do
  echo -e "[$i] ${commit_types[$i]}"
done

echo ""
read -p $'\033[0;36m请选择提交类型编号:\033[0m ' type_num

if [[ $type_num =~ ^[0-9]+$ ]] && [ "$type_num" -lt "${#commit_types[@]}" ]; then
  commit_type=$(echo "${commit_types[$type_num]}" | cut -d':' -f1)
else
  echo -e "${RED}无效的选择，使用默认类型 'chore'${NC}"
  commit_type="chore"
fi

# 提交范围（可选）
echo ""
read -p $'\033[0;36m请输入提交范围 (可选，如: core, ui):\033[0m ' commit_scope

# 提交简短描述
echo ""
read -p $'\033[0;36m请输入提交简短描述 (必填):\033[0m ' commit_subject

if [ -z "$commit_subject" ]; then
  echo -e "${RED}错误: 提交描述不能为空${NC}"
  exit 1
fi

# 构建提交信息
if [ -z "$commit_scope" ]; then
  commit_msg="${commit_type}: ${commit_subject}"
else
  commit_msg="${commit_type}(${commit_scope}): ${commit_subject}"
fi

# 提交详细描述（可选）
echo ""
echo -e "${CYAN}请输入详细描述 (可选，输入空行结束):${NC}"
commit_body=""
while IFS= read -r line; do
  # 当输入空行时结束
  [ -z "$line" ] && break
  commit_body="${commit_body}${line}
"
done

# 如果有详细描述，添加到提交信息中
if [ ! -z "$commit_body" ]; then
  commit_msg="${commit_msg}

${commit_body}"
fi

# 显示最终的提交信息
echo ""
echo -e "${YELLOW}最终提交信息:${NC}"
echo -e "${PURPLE}${commit_msg}${NC}"

# 确认提交
echo ""
read -p $'\033[0;33m确认提交? (y/n):\033[0m ' confirm_commit

if [[ $confirm_commit != [yY] ]]; then
  echo -e "${RED}提交已取消${NC}"
  exit 0
fi

# 执行提交
echo ""
git commit -m "$commit_msg"

# 询问是否要推送
echo ""
read -p $'\033[0;33m是否推送到远程仓库? (y/n):\033[0m ' push_confirm

if [[ $push_confirm == [yY] ]]; then
  # 获取当前分支名
  current_branch=$(git symbolic-ref --short HEAD)
  
  # 询问推送到哪个远程仓库
  remotes=$(git remote)
  if [ -z "$remotes" ]; then
    echo -e "${RED}没有配置远程仓库${NC}"
    exit 0
  fi
  
  # 如果只有一个远程仓库，直接使用它
  if [ $(echo "$remotes" | wc -l) -eq 1 ]; then
    remote="$remotes"
  else
    # 如果有多个远程仓库，让用户选择
    echo -e "${CYAN}可用的远程仓库:${NC}"
    readarray -t remote_array < <(echo "$remotes")
    
    for i in "${!remote_array[@]}"; do
      echo "[$i] ${remote_array[$i]}"
    done
    
    read -p $'\033[0;36m请选择远程仓库编号:\033[0m ' remote_num
    
    if [[ $remote_num =~ ^[0-9]+$ ]] && [ "$remote_num" -lt "${#remote_array[@]}" ]; then
      remote="${remote_array[$remote_num]}"
    else
      echo -e "${RED}无效的选择，使用默认远程 'origin'${NC}"
      remote="origin"
    fi
  fi
  
  echo -e "${GREEN}正在推送到 ${remote}/${current_branch}...${NC}"
  git push "$remote" "$current_branch"
fi

echo ""
echo -e "${GREEN}提交完成!${NC}"
echo -e "${BLUE}==================================================${NC}"